(function () {
    Vue.component("first-component", {
        template: "#template",
        props: ["id"],
        mounted: function () {
            this.modal();
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
        watch: {
            id: function () {
                this.modal();
            },
        },
        methods: {
            modal: function () {
                var self = this;
                axios
                    .post("/getImage/" + this.id)
                    .then(function (response) {
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
                        self.comments = response.data;
                    })
                    .catch(function (err) {
                        console.log("err in axios comments", err);
                    });
            },
            closeModal: function () {
                this.$emit("close");
            },
            addComment: function (e) {
                e.preventDefault();
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
            showModal: location.hash.slice(1),
            cards: [],
            title: "",
            description: "",
            username: "",
            file: null,
        },
        mounted: function () {
            console.log("my vue has MOUNTED");
            var self = this;
            axios.get("/cards").then(function (response) {
                self.cards = response.data;
            });
            window.addEventListener("hashchange", function () {
                console.log("hash change fired!!!");
                console.log("location.hash", location.hash);
                self.showModal = location.hash.slice(1);
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
                this.showModal = null;
                location.hash = "";
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
