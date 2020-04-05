<template>
    <div id="header">
        <span class="colorbox"></span>
        <ul>
            <li>
                <img class="logo" src="../assets/logo.jpg" alt />
            </li>
            <li class="nikename">
                <h2>悲伤日记</h2>
                <p class="BeiShangText">青房白瓦，亭台水榭</p>
            </li>
            <li @click="nav()" :class="[hash=='/'?'active':'']">
                <router-link to="/" exact>博客总览</router-link>
            </li>
            <li @click="nav()" :class="[hash=='/addBlog'?'active':'']">
                <router-link to="/addBlog" exact>发表博客</router-link>
            </li>
            <li>
                <a href="#">关于悲伤</a>
            </li>
            <li @click="nav()" :class="[hash=='/Friendship'?'active':'']">
                <router-link to="/Friendship" exact>友情链接</router-link>
            </li>
        </ul>
    </div>
</template>
<script>
    export default {
        name: "Header",
        data() {
            return {
                navNumber: 0,
                hash: this.$route.path
            };
        },
        watch: {
            hash(newVal, oldVal) {
                // hash改变值
            }
        },
        methods: {
            // 切换导航修改hash
            nav() {
                this.hash = this.$route.path;
            }
        }
    };
</script>
<style scoped>
.BeiShangText {
    font-size: 12px;
    color: #666;
    font-family: Roboto, serif;
    margin-top: 20px;
}
.nikename {
    text-align: center;
    margin: 2em 0;
    margin-top: 0;
    font-family: Roboto, serif;
    font-size: 30px;
    transition: 0.3s;
}
.colorbox {
    height: 100px;
    width: 100%;
    display: inline-block;
    /* background-color: #ddd4d1; */
    transition: all 0.5s;
    background-image: url("https://up.enterdesk.com/edpic/b9/32/90/b93290fb021972c7806c7b21890af7ce.jpg");
    background-size: 100%;
}
.colorbox:hover {
    /* background-color: #83a7a0; */
    background-position: 0px -20px;
}
li {
    text-align: center;
}
.logo {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    position: relative;
    top: -50px;
    border: 1px solid #efefef;
    transition: all 0.5s;
    display: block;
    margin: 0 auto;
}
.logo:hover {
    transform: rotate(360deg);
    -ms-transform: rotate(360deg); /* Internet Explorer */
    -moz-transform: rotate(360deg); /* Firefox */
    -webkit-transform: rotate(360deg); /* Safari 和 Chrome */
    -o-transform: rotate(360deg); /* Opera */
}
.active {
    background: #3f4948;
}
.active > a {
    color: #fff;
    font-weight: 600;
}
div {
    width: 240px;
    height: 100%;
    display: block;
    box-sizing: border-box;
    position: fixed;
    top: 0px;
    bottom: 0px;
    margin: auto;
    overflow: auto;
    background: #efefef;
    /* z-index: 100000; */
}
a {
    display: block;
    text-decoration: none;
    color: #000;
    margin-right: 5px;
    padding: 12px;
    border-radius: 4px;
    font-size: 14px;
}
</style>
