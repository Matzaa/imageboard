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

                    self.url = response.data.url;
                    self.description = response.data.description;
                })
                .catch(function (err) {
                    console.log("err in component POST axios", err);
                });
        },
        data: function () {
            return {
                // name: "Bob",
                // count: 0,
                // image: {},
                description: "",
                url: "",
            };
        },
        methods: {
            closeModal: function () {
                console.log("Im emitting from the component");
                this.$emit("close");
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
            fruits: [
                {
                    title: "🥝",
                    id: 1,
                },
                {
                    title: "🍓",
                    id: 2,
                },
                {
                    title: "🍋",
                    id: 3,
                },
            ],
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
