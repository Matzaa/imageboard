(function () {
    Vue.component("first-component", {
        template: "#template",
        // props: ["postTitle", "id"],
        props: ["id"],
        mounted: function () {
            console.log("this in mounted component ", this);
            console.log("id in mounted of component", this.id);
            var self = this;
            axios
                .post("/getImage/" + this.id)
                .then(function (response) {
                    console.log("res inside component axios", response);
                    self.username = response.data.username;
                    self.title = response.data.title;
                    self.url = response.data.url;
                    self.description = response.data.description;
                })
                .catch(function (err) {
                    console.log("err in component POST axios", err);
                });
            axios
                .post("/getComments/" + this.id)
                .then(function (response) {
                    console.log("response inside comments axios", response);
                    self.comments = response.data;
                })
                .catch(function (err) {
                    console.log("err in axios comments", err);
                });
        },
        data: function () {
            return {
                description: "",
                url: "",
                username: "",
                title: "",
                comments: [],
                comment: "",
                commenter: "",
            };
        },
        methods: {
            closeModal: function () {
                console.log("Im emitting from the component");
                this.$emit("close");
            },
            addComment: function (e) {
                e.preventDefault();
                console.log("I want to add a comment");
                var self = this;
                console.log("this inside addCommetn method", this);
                let newComment = {
                    comment: this.comment,
                    commenter: this.commenter,
                };
                axios
                    .post("postComment/" + this.id, newComment)
                    .then(function (resp) {
                        console.log("resp in addcomment podst", resp);
                        self.comments.unshift(resp.data.rows[0]);
                    })
                    .catch(function (err) {
                        console.log("err in postComment", err);
                    });
            },
        },
    });
    new Vue({
        el: "#main",
        data: {
            // name: "msg",
            // seen: false,
            showModal: null,
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
                console.log("response inside instance axios", response);
                self.cards = response.data;
                console.log("this/self inside axios", self);
            });
        },
        methods: {
            loadMore: function (e) {
                e.preventDefault();
                var num = this.cards.length - 1;
                console.log("this.cards.length.id", this.cards[num]);
                var self = this;
                let lastId = this.cards[num].id;
                axios
                    .post("/more/" + lastId)
                    .then(function (resp) {
                        console.log("resp in loadMore", ...resp.data);
                        self.cards.push(...resp.data);
                        console.log("self.cards in getmore", self.cards);
                    })
                    .catch(function (err) {
                        "err in gettin more images", err;
                    });
            },
            closeMe: function () {
                console.log("Im parent I will close now, e", this);
                this.showModal = null;
            },
            handleClick: function (e) {
                e.preventDefault();
                console.log("this in handleclick", this);
                var self = this;
                var formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("file", this.file);
                axios
                    .post("/upload", formData)
                    .then(function (resp) {
                        console.log("resp from POST/upload", resp);

                        self.cards.unshift(resp.data.results.rows[0]);
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
