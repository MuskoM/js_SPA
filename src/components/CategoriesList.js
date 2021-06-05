import React from "react";
import axios from "axios";
import Table from "./Table";
import Switch from "react-switch";
import { store } from 'react-notifications-component';

class Categories extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            loading: true,
            currentCategory: null
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
            onScreen: true
        }
    }

    createCategory = () => {
        this.showCategoryModal("createCategoryModal");
    };

    editCategory = (row) => {
        var category = row.values;
        console.log("ROW", category);
        this.setState({ currentCategory: category });

        this.showCategoryModal("editCategoryModal");
    };

    deleteCategory = (row) => {
        var category = row.values;
        var id = category.id;
        this.setState({ currentCategory: category });
        console.log(category);
        var name = document.getElementById("nameDelete");
        var description = document.getElementById("descriptionDelete");
        name.innerHTML = `Name: ${category.name}`;
        description.innerHTML = `Description: ${category.description}`;

        this.showCategoryModal("deleteCategoryModal");
    }

    submitDelete = () => {
        var modal = document.getElementById("deleteCategoryModal");
        modal.style.display = "none";
        var category = this.state.currentCategory;
        axios.delete('http://localhost:8002/categories/' + category.id).then(response => {
            this.setState({ loading: true });
            store.addNotification({
                ...this.notification,
                title: "Success!",
                message: "Deleted category from database.",
                type: "success"
            });
        }).catch(error => {
            console.log(error);
            store.addNotification({
                ...this.notification,
                title: "Error!",
                message: error,
                type: "danger"
            });
        });
    }

    saveChanges = () => {
        var modal = document.getElementById("editCategoryModal");
        modal.style.display = "none";
        var name = document.getElementById("nameEdit");
        var description = document.getElementById("descriptionEdit");
        var category = {name: name.value, description: description.value};
        axios.put('http://localhost:8002/categories/' + this.state.currentCategory.id, { name: category.name, description: category.description }).then(response => {
            this.setState({ loading: true });
            store.addNotification({
                ...this.notification,
                title: "Success!",
                message: "Made changes in database.",
                type: "success"
            });
        }).catch(error => {
            console.log(error);
            store.addNotification({
                ...this.notification,
                title: "Error!",
                message: error,
                type: "danger"
            });
        });
    }

    saveCreate = () => {
        var modal = document.getElementById("createCategoryModal");
        modal.style.display = "none";
        var name = document.getElementById("nameCreate");
        var description = document.getElementById("descriptionCreate");
        var category = {name: name.value, description: description.value};
        axios.post('http://localhost:8002/categories', { name: category.name, description: category.description }).then(response => {
            this.setState({ loading: true });
            store.addNotification({
                ...this.notification,
                title: "Success!",
                message: "New category created.",
                type: "success"
            });
        }).catch(error => {
            console.log(error);
            store.addNotification({
                ...this.notification,
                title: "Error!",
                message: error,
                type: "danger"
            });
        });
    }

    showCategoryModal = (name) => {
        var modal = document.getElementById(name);
        modal.style.display = "block";
    }

    hideCategoryModal = (name) => {
        var modal = document.getElementById(name);
        modal.style.display = "none";
    }

    async getCategories() {
        const res = await axios.get("http://localhost:8002/categories");
        this.setState({ loading: false, categories: res.data });
    }

    render() {
        var editCategoryModal = document.getElementById("editCategoryModal");
        var deleteCategoryModal = document.getElementById("deleteCategoryModal");

        window.onclick = function (event) {
            if (event.target == editCategoryModal) {
                editCategoryModal.style.display = "none";
            }
            if (event.target == deleteCategoryModal) {
                editCategoryModal.style.display = "none";
            }
        }

        if (this.state.loading) this.getCategories();
        const columns = [
            { Header: "ID", accessor: "id" },
            { Header: "Name", accessor: "name" },
            { Header: "Description", accessor: "description" },
            {
                accessor: "[buttons]",
                Cell: (cellObj) => (
                    <>
                        <button
                            type="button"
                            class="btn btn-primary mr-4"
                            onClick={() => this.editCategory(cellObj.row)}
                        >
                            Edit
          </button>
                        <button
                            type="button"
                            class="btn btn-primary"
                            onClick={() => this.deleteCategory(cellObj.row)}
                        >
                            Delete
          </button>
                    </>
                ),
            },
        ];

        return (
            <div>
                <div>
                    <label>Add new category</label>
                    <button
                        type="button"
                        class="btn btn-primary"
                        onClick={() => this.createCategory()}
                    >Create</button>
                </div>
                <Table columns={columns} data={this.state.categories} />
                <div id="editCategoryModal" class="modal">
                    <div class="modal-content">
                        <span class="close" onClick={() => this.hideCategoryModal("editCategoryModal")}>&times;</span>
                        <h3>Edit category:</h3>
                        <div>
                            Name<br />
                            <input type="text" id="nameEdit" autoComplete="new-password" class="form-control" />
                        </div>
                        <div>
                            Description<br />
                            <input type="text" id="descriptionEdit" autoComplete="new-password" class="form-control" />
                        </div>
                        <button
                            type="button"
                            class="btn btn-primary"
                            onClick={() => this.saveChanges()}
                        >Submit</button>
                    </div>
                </div>
                <div id="deleteCategoryModal" class="modal">
                    <div class="modal-content">
                        <span class="close" onClick={() => this.hideCategoryModal("deleteCategoryModal")}>&times;</span>
                        <h3>Are you sure you want to delete category?</h3>
                        <p id="nameDelete">Name: </p>
                        <p id="descriptionDelete">Description: </p>
                        <button
                            type="button"
                            class="btn btn-primary btn-danger"
                            onClick={() => this.submitDelete()}
                        >Yes</button>
                    </div>
                </div>
                <div id="createCategoryModal" class="modal">
                    <div class="modal-content">
                        <span class="close" onClick={() => this.hideCategoryModal("createCategoryModal")}>&times;</span>
                        <h3>Create category:</h3>
                        <div>
                            Name<br />
                            <input type="text" id="nameCreate" class="form-control" />
                        </div>
                        <div>
                            Description<br />
                            <input type="text" id="descriptionCreate" class="form-control" />
                        </div>
                        <button
                            type="button"
                            class="btn btn-primary"
                            onClick={() => this.saveCreate()}
                        >Submit</button>
                    </div>
                </div>
            </div >
        );
    }
}

export default Categories;
