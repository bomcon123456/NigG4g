import React, { Fragment } from "react";
import classnames from "classnames";

import { KComponent } from "../../../../components/KComponent";
import SectionPicker from "../../../react/section-picker/section-picker";
import { modals } from "../modals";

import { LoadingInline } from "../../loading-inline/loading-inline";

export class ReportModal extends KComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: null,
      currentReason: null,
      proceed: false
    };

    this.reportData = [
      {
        name: "Spam",
        description: [
          {
            type: "p",
            content: "Report as spam?"
          },
          {
            type: "p",
            content: "We remove:"
          },
          {
            type: "ul",
            content: ["Clickbait", "Advertising", "Scam", "Script bot"]
          },
          {
            type: "p",
            content:
              "If you report someone's post, 9GAG doesn't tell them who reported it."
          }
        ]
      },
      {
        name: "Pornography",
        description: [
          {
            type: "",
            content: ""
          }
        ]
      },
      {
        name: "Hatred and bullying",
        description: [
          {
            type: "",
            content: ""
          }
        ]
      },
      {
        name: "Self-Harm",
        description: [
          {
            type: "",
            content: ""
          }
        ]
      },
      {
        name: "Violent, gory and harmful content",
        description: [
          {
            type: "",
            content: ""
          }
        ]
      },
      {
        name: "Child Porn",
        description: [
          {
            type: "",
            content: ""
          }
        ]
      },
      {
        name: "Illegal activities e.g. Drug Uses",
        description: [
          {
            type: "",
            content: ""
          }
        ]
      },
      {
        name: "Deceptive content",
        description: [
          {
            type: "",
            content: ""
          }
        ]
      },
      {
        name: "Copyright and trademark infringement",
        description: [
          {
            type: "",
            content: ""
          }
        ]
      }
    ];
    this.reasons = this.reportData.map(each => {
      return {
        name: each.name
      };
    });
  }

  handleServerError = () => {
    const { error } = this.state;
    const message = error.message;
    let errMatcher = {
      invalid_url: "Invalid URL.",
      network_error: "Database is ded."
    };
    return errMatcher.hasOwnProperty(message)
      ? errMatcher[message]
      : "Something bad happened.";
  };

  handleSectionClick = section => {
    this.setState({ currentReason: section.name });
  };

  handleCancelClicked = () => {
    if (!this.state.proceed) {
      this.props.onClose();
    } else {
      this.setState({ currentReason: null, proceed: false });
    }
  };

  handleNext = () => {
    this.setState({ proceed: true });
  };

  render() {
    let { onClose } = this.props;
    let { loading, currentReason, proceed } = this.state;
    let reportContent = null;
    if (proceed) {
      console.log(currentReason);
      let reportDescription = this.reportData.filter(
        each => each.name === currentReason
      );
      reportContent = reportDescription[0].description.map((each, index) => {
        if (each.type === "p") {
          return <p key={"p" + index}>{each.content}</p>;
        } else if (each.type === "ul") {
          let listContent = each.content.map(list => {
            return <li key={list}>{list}</li>;
          });
          return <ul key={"ul" + index}>{listContent}</ul>;
        } else {
          return null;
        }
      });
    }

    return (
      <div
        className={classnames("report-modal", {
          shorter: proceed
        })}
      >
        <Fragment>
          <div className="modal-header report-modal-header no-border">
            <div className="modal-title ">
              <h4 className="modal-title-text">Report</h4>
              <p className="modal-subtitle-text">
                Choosing the right reason help us process the report as soon as
                possible.
              </p>
            </div>
            <i className="fas fa-times close-modal" onClick={() => onClose()} />
          </div>
          <div className="modal-body report-modal-body">
            {loading ? <LoadingInline /> : null}
            {!proceed ? (
              <SectionPicker
                data={this.reasons}
                handleClick={this.handleSectionClick}
                defaultSection={currentReason}
              />
            ) : null}
            {this.state.error && (
              <div className="server-error">{this.handleServerError()}</div>
            )}
            {proceed ? (
              <div className="reason-explain">{reportContent}</div>
            ) : null}
          </div>
          <div className="modal-footer report-modal-footer no-border">
            <button
              className="btn btn-secondary"
              onClick={this.handleCancelClicked}
            >
              {proceed ? "Back " : "Cancel"}
            </button>
            <button
              className="btn btn-primary"
              disabled={currentReason === null || this.state.loading}
              onClick={this.handleNext}
            >
              {loading ? "Loading" : "Next"}
            </button>
          </div>
        </Fragment>
      </div>
    );
  }
}

export const reportModal = {
  open() {
    const modal = modals.openModal({
      content: <ReportModal onClose={() => modal.close()} />
    });
    return modal.result;
  }
};
