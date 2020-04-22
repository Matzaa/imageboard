// import { axios } from "aws-sdk";

(function () {
    new Vue({
        el: "#main",
        data: {
            name: "msg",
            seen: false,
            cards: [],
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
        },
    });
})();
