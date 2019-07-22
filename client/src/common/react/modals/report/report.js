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
            type: "p",
            content: "Report as spam?"
          },
          {
            type: "p",
            content: "We remove:"
          },
          {
            type: "ul",
            content: [
              "Photos or videos of sexual intercourse",
              "Posts showing sexual intercourse, genitals or close-ups of fully-nude buttocks"
            ]
          },
          {
            type: "p",
            content:
              "If you report someone's post, 9GAG doesn't tell them who reported it."
          }
        ]
      },
      {
        name: "Hatred and bullying",
        description: [
          {
            type: "p",
            content: "Report as hatred and bullying?"
          },
          {
            type: "p",
            content: "We remove:"
          },
          {
            type: "ul",
            content: [
              "Posts that contain credible threat",
              "Posts that target people to degrade or shame them",
              "Personal information shared to blackmail or harass",
              "Posts or threats to post nude photo of you"
            ]
          },
          {
            type: "p",
            content:
              "If you report someone's post, 9GAG doesn't tell them who reported it."
          }
        ]
      },
      {
        name: "Self-Harm",
        description: [
          {
            type: "p",
            content: "Report as self injury?"
          },
          {
            type: "p",
            content: "We remove:"
          },
          {
            type: "p",
            content:
              "We remove posts encouraging or promoting self injury, which includes suicide, cutting and eating disorders. We may also remove posts identifying victims of self injury if the post attacks or makes fun of them."
          },
          {
            type: "p",
            content:
              "If you report someone's post, 9GAG doesn't tell them who reported it."
          }
        ]
      },
      {
        name: "Violent, gory and harmful content",
        description: [
          {
            type: "p",
            content: "Report as violent, gory and harmful content?"
          },
          {
            type: "p",
            content: "We remove:"
          },
          {
            type: "ul",
            content: [
              "Photos or videos of extreme graphic violence",
              "Posts that encourage violence or attack anyone based on their religious, ethnic or sexual background",
              "Specific threats of physical harm, theft, vandalism or financial harm."
            ]
          },
          {
            type: "p",
            content:
              "If you report someone's post, 9GAG doesn't tell them who reported it."
          }
        ]
      },
      {
        name: "Child Porn",
        description: [
          {
            type: "p",
            content: "Report as child porn?"
          },
          {
            type: "p",
            content: "We remove:"
          },
          {
            type: "ul",
            content: [
              "Photos or videos of sexual intercourse with children",
              "Posts of nude or partially nude children"
            ]
          },
          {
            type: "p",
            content:
              "If you report someone's post, 9GAG doesn't tell them who reported it."
          }
        ]
      },
      {
        name: "Illegal activities e.g. Drug Uses",
        description: [
          {
            type: "p",
            content: "Report as illegal activities?"
          },
          {
            type: "p",
            content: "We remove and may report to legal entity about:"
          },
          {
            type: "ul",
            content: [
              "Posts promoting illegal activities, e.g. the use of hard drugs",
              "Posts intended to sell or distribute drugs"
            ]
          },
          {
            type: "p",
            content:
              "If you report someone's post, 9GAG doesn't tell them who reported it."
          }
        ]
      },
      {
        name: "Deceptive content",
        description: [
          {
            type: "p",
            content: "Report as deceptive content?"
          },
          {
            type: "p",
            content: "We remove:"
          },
          {
            type: "ul",
            content: [
              "Purposefully fake or deceitful news",
              "Hoax disproved by a reputable source"
            ]
          },
          {
            type: "p",
            content:
              "If you report someone's post, 9GAG doesn't tell them who reported it."
          }
        ]
      },
      {
        name: "Copyright and trademark infringement",
        description: [
          {
            type: "p",
            content:
              "We provides an online platform to allows users to upload and share images, videos, and other content. We take the rights of intellectual property owners very seriously and comply as a service provider with all applicable provisions of the United States Digital Millennium Copyright Act."
          },
          {
            type: "p",
            content:
              "If you want to report content that you believe violates or infringes your copyright, please tap continue and fill out the 9GAG DMCA Copyright Infringement Notification form. Note that a report alleging infringement or violation of legal rights must come from the rights owner or someone authorized to report on their behalf (e.g. attorney, agent). If you are not the rights owner or their authorized representative, we will not be able to process your report."
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
        style={{
          height:
            proceed && currentReason === "Copyright and trademark infringement"
              ? "530px"
              : ""
        }}
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
