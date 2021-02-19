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
import { BASE_URL } from "../../constant/constants";

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

// Our PondUpload
export default class PondUpload extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Set initial files, type 'local' means this is a file
      // that has already been uploaded to the server (see docs)
      files: [
    
      ],
    };
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
          maxFiles={1}
          server={`${BASE_URL}/api/DRS.APA/common/Uploads?type=blogs`}
          name="files"
          oninit={() => this.handleInit()}
          onprocessfile={(error, file) => {
            console.log("server id", JSON.parse(file.serverId).data);
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
          onupdatefiles={(fileItems) => {
            // Set currently active file objects to this.state
            console.log(fileItems, "dsadasdsadsadsad");
            this.setState({
              files: fileItems.map((fileItem) => fileItem.file),
            });
          }}
        />
      </div>
    );
  }
}
