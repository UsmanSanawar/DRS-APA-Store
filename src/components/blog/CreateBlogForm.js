import React, { Component } from "react";
import RestService from "../../store/restService/restService";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import FullEditor from "ckeditor5-build-full";
import { toast } from "react-toastify";

export default class CreateBlogForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      formData: {
        blogId: 0,
        blogTitle: "",
        content: "",
        isApproved: true,
        approvedDate: null,
        seoH1: "",
        seoH2: "",
        seoH3: "",
        metaTagTitle: "",
        metaTagDescription: "",
        metaTagKeywords: "",
        blogCategoryId: 0,
        customerId: parseInt(localStorage.getItem("identity")),
        image: "",
        isActive: true,
      },
      allCategories: [],
    };
  }

  componentDidMount() {
    RestService.getBlogCategories().then((res) => {
      if (res.data.status === "success") {
        this.setState({
          allCategories: res.data.data,
        });
      }
    });
  }

  handleChange = (event) => {
    const { formData } = this.state;
    if (event.target.type == "checkbox") {
      formData[event.target.name] = event.target.checked;
    } else {
      formData[event.target.name] = event.target.value;
    }
    this.setState({ formData });
  };

  handleSubmit = () => {
		let {formData} = this.state;
		RestService.postBlog(formData).then(res => {
			toast[res.data.status](res.data.message)
			if (res.data.status === 'success') {
				window.location.reload()
			}
		})
	};


	handleCancel = () => {
		this.props.handleForm(false);
		this.setState({
			formData: {
        blogId: 0,
        blogTitle: "",
        content: "",
        isApproved: true,
        approvedDate: null,
        seoH1: "",
        seoH2: "",
        seoH3: "",
        metaTagTitle: "",
        metaTagDescription: "",
        metaTagKeywords: "",
        blogCategoryId: 0,
        customerId: parseInt(localStorage.getItem("identity")),
        image: "",
        isActive: true,
      }
		})
	}
  render() {
    const { formData, allCategories } = this.state;

    return (
      <div>
        <h2 className="mb-2">Create Blog Post</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            this.handleSubmit();
          }}
        >
          <div className="pt-2">
            <div className="form-row">
              <div className="form-group col-6">
                <label htmlFor="name">Blog Title</label>
                <input
                  id="blogTitle"
                  required
                  type="text"
                  className="form-control"
                  placeholder="Enter blog title"
                  name="blogTitle"
                  onChange={(event) => this.handleChange(event)}
                  value={formData.blogTitle || ""}
                />
              </div>

              <div className="form-group col-6">
                <label htmlFor="phone">Blog Category</label>
                <select
                  id="blogCategoryId"
                  className="form-control border"
                  placeholder="Select customer group"
                  name="blogCategoryId"
                  onChange={(event) => this.handleChange(event)}
                  value={formData.blogCategoryId || ""}
                >
                  <option value="" key="">
                    N/A
                  </option>

                  {allCategories &&
                    allCategories.map((item) => (
                      <option
                        key={item.blogCategoryId}
                        value={item.blogCategoryId}
                      >
                        {item.categoryName}
                      </option>
                    ))}
                </select>
              </div>

              <div className="form-group col-6">
                <label htmlFor="phone">SEO H1</label>
                <input
                  id="seoH1"
                  type="text"
                  className="form-control"
                  placeholder="Enter SEO H1"
                  name="seoH1"
                  onChange={(event) => this.handleChange(event)}
                  value={formData.seoH1 || ""}
                />
              </div>
              <div className="form-group col-6">
                <label htmlFor="phone">SEO H2</label>
                <input
                  id="seoH2"
                  type="text"
                  className="form-control"
                  placeholder="Enter SEO H2"
                  name="seoH2"
                  onChange={(event) => this.handleChange(event)}
                  value={formData.seoH2 || ""}
                />
              </div>
              <div className="form-group col-6">
                <label htmlFor="phone">SEO H3</label>
                <input
                  id="seoH3"
                  type="text"
                  className="form-control"
                  placeholder="Enter SEO H3"
                  name="seoH3"
                  onChange={(event) => this.handleChange(event)}
                  value={formData.seoH3 || ""}
                />
              </div>

              <div className="form-group col-6">
                <label htmlFor="phone">Meta Title</label>
                <input
                  id="metaTagTitle"
                  type="text"
                  className="form-control"
                  placeholder="Enter Meta Title"
                  name="metaTagTitle"
                  onChange={(event) => this.handleChange(event)}
                  value={formData.metaTagTitle || ""}
                />
              </div>

              <div className="form-group col-6">
                <label htmlFor="phone">Meta Keywords</label>
                <input
                  id="metaTagKeywords"
                  type="text"
                  className="form-control"
                  placeholder="Enter Meta Title"
                  name="metaTagKeywords"
                  onChange={(event) => this.handleChange(event)}
                  value={formData.metaTagKeywords || ""}
                />
              </div>

              <div className="form-group col-12">
                <label htmlFor="phone">Meta Description</label>
                <input
                  id="metaTagDescription"
                  type="text"
                  className="form-control"
                  placeholder="Enter Meta Description"
                  name="metaTagDescription"
                  onChange={(event) => this.handleChange(event)}
                  value={formData.metaTagDescription || ""}
                />
              </div>
            </div>
            <div className="form-group w-100 p-0 col-12">
              <label className="label">Content</label>
              <CKEditor
                editor={FullEditor}
                config={
                  {
                    // ...Ckeditor config
                  }
                }
                data={this.state.content}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  console.log({ event, editor, data });
                  this.handleChange({
                    target: { name: "content", value: data },
                  });
                }}
              />
            </div>
          </div>

          <div className="row p-3">
            <button type={"submit"} className="btn btn-success mr-2 d-inline">
              Submit
            </button>
            <button
              onClick={this.handleCancel}
              type="button"
              className="btn btn-danger"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }
}
