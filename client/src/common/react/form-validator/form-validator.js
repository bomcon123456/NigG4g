import get from "lodash/get";
import update from "lodash/update";

import { createEventEmitter, keyEvents } from "../../events/events";

require("./yup-configs");

export const createFormWithValidator = (schema, _options) => {
  const defaultOptions = {
    validateOnBlur: true,
    validateOnChange: false,
    initData: {}
  };

  let options = Object.assign({}, defaultOptions, _options);

  let state = { ...options.initData };
  let errors = {};
  let touched = {};
  let eventManagement = createEventEmitter();

  const getPathData = path => {
    return get(state, path);
  };

  const updatePathData = (path, data) => {
    update(state, path, () => data);
  };

  const validateData = async () => {
    try {
      await schema.validate({ ...state }, { abortEarly: false });
      errors = {};
    } catch (e) {
      errors = {};
      /*
       ********* VALIDATION ERROR SCHEMA **********
       ***ValidationError:
       *errors: (2) ["Email không được để trống", "Mật khẩu bắt buộc từ 6 ký tự trở lên"]
       *inner: (2) [ValidationError, ValidationError]
      -----0: ValidationError {name: "ValidationError", value: "", path: "email", type: "required", errors: Array(1), …}
      -----1: ValidationError {name: "ValidationError", value: "", path: "password", type: "min", errors: Array(1), …}
       *message: "2 errors occurred"
       *name: "ValidationError"
       *path: undefined
       *type: undefined
       *value: {email: "", password: ""}
       *stack: "ValidationError: 2 errors occurred↵    at eval (webpack-internal:///./node_modules/yup/lib/util/runValidations.js:98:30)"
       *__proto__: Error
       */

      if (e.inner && e.inner.length > 0) {
        e.inner.forEach(error => {
          errors[error.path] = error;
        });
      } else {
        // One error only
        errors[e.path] = e;
      }
    }
  };

  const validatePath = async path => {
    try {
      await schema.validateAt(path, state);
      delete errors[path];
    } catch (e) {
      errors[path] = e;
    }
  };

  // Pass on the OnKeyDown
  const onEnter = path => e => {
    if (keyEvents.isEnter(e)) {
      eventManagement.emit("enter");
    }
  };

  const onChange = (path, validateOnChange, relativeFields) => async e => {
    // eslint-disable-next-line eqeqeq
    const value = e.target && e.type == "change" ? e.target.value : e;

    updatePathData(path, value);

    eventManagement.emit("change", state);

    if (validateOnChange || options.validateOnChange) {
      if (!touched[path]) {
        touched[path] = true;
      }
      if (relativeFields && relativeFields.length) {
        for (let p of relativeFields) await validatePath(p);
      }
      if (options && options.validateAll) {
        await validateData();
      } else {
        await validatePath(path);
      }

      eventManagement.emit("change", state);
    }
  };

  // Pass on onBlur
  const onBlur = path => async e => {
    if (!touched[path]) {
      touched[path] = true;
    }
    try {
      await schema.validateAt(path, state);
      delete errors[path];
    } catch (e) {
      errors[path] = e;
    }
    eventManagement.emit("change", state);
  };

  return {
    setSchema: (newSchema = {}) => {
      schema = newSchema;
    },
    on: eventManagement.on,
    validateData: async () => {
      await validateData();
      eventManagement.emit("change", state);
    },
    getInvalidPaths: () => Object.keys(errors),
    getErrorPath: path => (touched[path] ? { ...errors[path] } : null),
    getData: () => ({ ...state }),
    updatePathData: async (path, data) => {
      updatePathData(path, data);
      await validatePath(path);
      eventManagement.emit("change", state);
    },
    resetData: async (data = {}) => {
      state = Object.assign({}, data, options.initData);

      await validateData();
      touched = {};
      eventManagement.emit("change", state);
    },
    setInitData: (data = {}) => {
      options = Object.assign({}, options, { initData: data });
    },
    updateData: async data => {
      state = Object.assign({}, state, data);
      await validateData();

      eventManagement.emit("change", state);
    },
    isValid: () => Object.keys(errors).length === 0,
    getPathData,
    enhancedInput: (path, validateOnChange = false) => {
      return {
        value: getPathData(path),
        onChange: onChange(path, validateOnChange),
        onBlur: onBlur(path)
      };
    },
    /** FLOW
     *  this.form.enhancedComponent("password", ({error, onChange, onEnter, ...others}) => <Component/>)
        1. The function below will be call first
        2. This function will:
          2.1. CALL the componentCreatorFunc, which is the ({error, onChange,...} => <Component />), with the following params
          2.2. Return that component, with the props assigned, with the value from the params ({error, onchange ,...})
     cac
          */
    enhancedComponent: (
      path,
      componentCreatorFunc,
      validateOnChange = false,
      relativeFields = []
    ) => {
      return componentCreatorFunc({
        value: getPathData(path),
        onChange: onChange(path, validateOnChange, relativeFields),
        onBlur: onBlur(path),
        error: touched[path] ? errors[path] : null,
        onEnter: onEnter(path)
      });
    }
  };
};

/** EXAMPLE
 {this.form.enhanceComponent("email", ({error, onChange, onEnter, ...others}) => (
  <InputBase
    className="registration-input pt-0"
    error={error}
    placeholder={"abc@xyz.com"}
    id={"email"}
    onKeyDown={onEnter}
    disabled={confirmRegisterData}
    type={"text"}
    label={"Email"}
    onChange={e => {

      this.setState({error: ""});
      onChange(e);
    }}
    {...others}
  />
), true)}
 */
