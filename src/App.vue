<template>
    <div id="app">
        <blog-header></blog-header>
        <router-view></router-view>
    </div>
</template>

<script>
    import AddBlog from "./components/AddBlog.vue";
    import ShowBlogs from "./components/ShowBlogs.vue";
    import BlogHeader from "./components/Header.vue";

    export default {
        name: "app",
        components: {
            AddBlog,
            ShowBlogs,
            BlogHeader
        }
    };
</script>

<style>
body {
    padding: 0;
    margin: 0;
}
</style>
