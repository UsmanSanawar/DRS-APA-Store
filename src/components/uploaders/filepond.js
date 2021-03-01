import React from "react";

// Import React FilePond
import { FilePond, registerPlugin } from "react-filepond";

// Import FilePond styles
import "filepond/dist/filepond.min.css";

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { BASE_URL, IMAGE_URL } from "../../constant/constants";

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

// Our PondUpload
export default class PondUpload extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Set initial files, type 'local' means this is a file
      // that has already been uploaded to the server (see docs)
      files: [],
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.initFiles !== this.props.initFiles) {
      this.setState({
        files: [
          {
            source: `${IMAGE_URL}/blogs/${this.props.initFiles}`,
            options: {
              type: "local",
            },
          },
        ],
      });
    }
  }

  handleInit() {
    console.log("FilePond instance has initialised", this.pond);
  }

  render() {
    let { name, onChange, multiple } = this.props;

    return (
      <div>
        <FilePond
          ref={(ref) => (this.pond = ref)}
          files={this.state.files}
          allowMultiple={multiple || false}
          allowReorder={false}
          onprocessfile={(error, file) => {
            let data = JSON.parse(file.serverId);
            if (Object.entries(data).length > 0) {
              onChange({
                target: {
                  name: name,
                  value: data.data,
                },
              });
            }
          }}
          maxFiles={1}
          server={{
            url: `${BASE_URL}/api/DRS.APA/common/Uploads?type=blogs`,
            load: (source, load, error, progress, abort, headers) => {
              var myRequest = new Request(
                "https://cors-anywhere.herokuapp.com/" + source
              );

              fetch(myRequest, {
                mode: "cors",
                headers: new Headers({
                  "Access-Control-Allow-Origin": "*",
                  "Content-Type": "*",
                }),
              }).then(function (response) {
                response.blob().then(function (myBlob) {
                  load(myBlob);
                });
              });
            },
          }}
          name="files"
          oninit={() => this.handleInit()}
          onupdatefiles={(fileItems) => {
            // Set currently active file objects to this.state
            this.setState({
              files: fileItems.map((fileItem) => fileItem.file),
            });
          }}
        />
      </div>
    );
  }
}
