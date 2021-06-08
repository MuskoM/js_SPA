import React from "react";
import axios from "axios";
import Table from "./Table";
import ColorPicker from "material-ui-color-picker";
// import Switch from "react-switch";
import { store } from "react-notifications-component";
import { FormControlLabel, TextField } from "@material-ui/core";
import { PrimaryButton, SecondaryButton } from "./Buttons";
class Categories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      loading: true,
      currentCategory: null,
    };
  }

  notification = {
    title: "Test notification",
    message: "You shouldn't see it here.",
    type: "success",
    insert: "bottom",
    container: "bottom-right",
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    dismiss: {
      duration: 5000,
      onScreen: true,
    },
  };

  createCategory = () => {
    var name = document.getElementById("nameCreate");
    var description = document.getElementById("descriptionCreate");
    name.value = "";
    description.value = "";
    this.showCategoryModal("createCategoryModal");
  };

  editCategory = (row) => {
    var category = row.values;
    var name = document.getElementById("nameEdit");
    var description = document.getElementById("descriptionEdit");
    name.value = category.name;
    description.value = category.description;
    this.setState({ currentCategory: category });

    this.showCategoryModal("editCategoryModal");
  };

  deleteCategory = (row) => {
    var category = row.values;
    var name = document.getElementById("categoryNameDelete");
    var description = document.getElementById("descriptionDelete");
    name.value = `${category.name}`;
    description.value = `${category.description}`;
    this.setState({ currentCategory: category });

    this.showCategoryModal("deleteCategoryModal");
  };

  submitDelete = () => {
    var modal = document.getElementById("deleteCategoryModal");
    modal.style.display = "none";
    var category = this.state.currentCategory;
    axios
      .delete("http://localhost:8002/categories/" + category.id)
      .then((response) => {
        this.setState({ loading: true });
        store.addNotification({
          ...this.notification,
          title: "Success!",
          message: "Deleted category from database.",
          type: "success",
        });
      })
      .catch((error) => {
        store.addNotification({
          ...this.notification,
          title: "Error!",
          message: error.message,
          type: "danger",
        });
      });
  };

  saveChanges = () => {
    var modal = document.getElementById("editCategoryModal");
    modal.style.display = "none";
    var name = document.getElementById("nameEdit");
    var description = document.getElementById("descriptionEdit");
    var category = { name: name.value, description: description.value };
    console.log(name.value);
    if (name.value === ""){
      store.addNotification({
        ...this.notification,
        title: "Error!",
        message: "Name cannot be empty!",
        type: "danger",
      });
      return;
    }
    axios
      .put(
        "http://localhost:8002/categories/" + this.state.currentCategory.id,
        { name: category.name, description: category.description }
      )
      .then((response) => {
        this.setState({ loading: true });
        store.addNotification({
          ...this.notification,
          title: "Success!",
          message: "Made changes in database.",
          type: "success",
        });
      })
      .catch((error) => {
        var err = "Something gone wrong";
        if (error.response.status == 409) err = "Name already in use";
        store.addNotification({
          ...this.notification,
          title: "Error!",
          message: err,
          type: "danger",
        });
      });
  };

  saveCreate = () => {
    var modal = document.getElementById("createCategoryModal");
    modal.style.display = "none";
    var name = document.getElementById("nameCreate");
    var description = document.getElementById("descriptionCreate");
    var category = { name: name.value, description: description.value };
    if (name.value === ""){
      store.addNotification({
        ...this.notification,
        title: "Error!",
        message: "Name cannot be empty!",
        type: "danger",
      });
      return;
    }
    axios
      .post("http://localhost:8002/categories", {
        name: category.name,
        description: category.description,
        color:this.state.color
      })
      .then((response) => {
        this.setState({ loading: true });
        store.addNotification({
          ...this.notification,
          title: "Success!",
          message: "New category created.",
          type: "success",
        });
      })
      .catch((error) => {
        var err = "Something gone wrong";
        if (error.response.status == 409) err = "Category already exists";
        store.addNotification({
          ...this.notification,
          title: "Error!",
          message: err,
          type: "danger",
        });
      });
  };

  showCategoryModal = (name) => {
    var modal = document.getElementById(name);
    modal.style.display = "block";
  };

  hideCategoryModal = (name) => {
    var modal = document.getElementById(name);
    modal.style.display = "none";
  };

  async getCategories() {
    const res = await axios.get("http://localhost:8002/categories");
    this.setState({ loading: false, categories: res.data });
  }

  render() {
    var editCategoryModal = document.getElementById("editCategoryModal");
    var deleteCategoryModal = document.getElementById("deleteCategoryModal");

    window.onclick = function (event) {
      if (event.target === editCategoryModal) {
        editCategoryModal.style.display = "none";
      }
      if (event.target === deleteCategoryModal) {
        editCategoryModal.style.display = "none";
      }
    };

    if (this.state.loading) this.getCategories();
    const columns = [
      { Header: "ID", accessor: "id" },
      { Header: "Name", accessor: "name" },
      { Header: "Description", accessor: "description" },
      {
        accessor: "[buttons]",
        Cell: (cellObj) => (
          <>
            <PrimaryButton
              className="Aux-btn"
              type="button"
              onClick={() => this.editCategory(cellObj.row)}
            >
              Edit
            </PrimaryButton>
            <SecondaryButton
              className="Aux-btn"
              type="button"
              onClick={() => this.deleteCategory(cellObj.row)}
            >
              Delete
            </SecondaryButton>
          </>
        ),
      },
    ];

    return (
      <div>
        <Table columns={columns} data={this.state.categories} />
        <div id="editCategoryModal" class="modal">
          <div class="modal-content">
            <span
              class="close"
              onClick={() => this.hideCategoryModal("editCategoryModal")}
            >
              &times;
            </span>
            <h3>Edit category:</h3>
            <div className="modal-element">
              <TextField
                variant="outlined"
                label="Name"
                id="nameEdit"
              ></TextField>
            </div>
            <div className="modal-element">
              <TextField
                variant="outlined"
                label="Description"
                id="descriptionEdit"
              ></TextField>
            </div>
            <SecondaryButton onClick={() => this.saveChanges()}>
              Submit
            </SecondaryButton>
          </div>
        </div>
        <div id="deleteCategoryModal" class="modal">
          <div class="modal-content">
            <span
              class="close"
              onClick={() => this.hideCategoryModal("deleteCategoryModal")}
            >
              &times;
            </span>
            <h3>Are you sure you want to delete category?</h3>
            <div className="modal-element">
              <TextField
                variant="outlined"
                disabled
                label="Name"
                id="categoryNameDelete"
              ></TextField>
            </div>
            <div className="modal-element">
              <TextField
                variant="outlined"
                disabled
                label="Description"
                id="descriptionDelete"
              ></TextField>
            </div>
            <SecondaryButton onClick={() => this.submitDelete()}>
              Yes
            </SecondaryButton>
          </div>
        </div>
        <div id="createCategoryModal" class="modal">
          <div class="modal-content">
            <span
              class="close"
              onClick={() => this.hideCategoryModal("createCategoryModal")}
            >
              &times;
            </span>
            <h3>Create category:</h3>
            <div className="modal-element">
              <TextField
                variant="outlined"
                label="Name"
                id="nameCreate"
              ></TextField>
            </div>
            <div className="modal-element">
              <TextField
                variant="outlined"
                label="Description"
                id="descriptionCreate"
              ></TextField>
            </div>
            <div className="modal-element">
              <ColorPicker
                name="color"
                defaultValue="#000"
                value={this.state.color}
                onChange={(color) => this.setState({color:color})}
              />
            </div>
            <SecondaryButton onClick={() => this.saveCreate()}>
              Submit
            </SecondaryButton>
          </div>
        </div>
        <div style={{padding:".3rem"}}>
          <PrimaryButton
            type="button"
            onClick={() => this.createCategory()}
          >
            Add category
          </PrimaryButton>
        </div>
      </div>
    );
  }
}

export default Categories;
