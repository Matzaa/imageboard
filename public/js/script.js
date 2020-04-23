// import { axios } from "aws-sdk";

(function () {
    new Vue({
        el: "#main",
        data: {
            // name: "msg",
            // seen: false,
            cards: [],
            title: "",
            description: "",
            username: "",
            file: null,
        },
        mounted: function () {
            console.log("my vue has MOUNTED");
            console.log("this outside axios", this);
            var self = this;
            axios.get("/cards").then(function (response) {
                // console.log("response from /cities", response.data);
                console.log("this INSIDE axios", self);
                self.cards = response.data;
                console.log("self", self);
            });
        },
        methods: {
            myFunction: function () {
                console.log("my function is running");
            },

            handleClick: function (e) {
                e.preventDefault();
                console.log("this", this);

                var formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("file", this.file);
                axios
                    .post("/upload", formData)
                    .then(function (resp) {
                        console.log("resp from POST/upload", resp);
                    })
                    .catch(function (err) {
                        console.log("err in POST upload", err);
                    });
            },
            handleChange: function (e) {
                console.log("handlechange is good");
                console.log("file:", e.target.files[0]);
                this.file = e.target.files[0];
            },
        },
    });
})();
