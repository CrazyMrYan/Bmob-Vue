<template>
    <div class="contenr">
        <div class="loading" v-if="loading">
            <i class="fa fa-spinner fa-spin"></i> 友链正在加载中...
        </div>
        <div v-else class="Friendship">
            <div class="logobox" v-for="(item,index) in DataList" :key="index">
                <img class="Friendshipimg" :src="item.image" alt srcset />
                <h5>{{item.name}}</h5>
                <p>{{item.content.substring(0,50)+'...'}}</p>
                <p class="linkbox">
                    <a :href="item.link" target="_blank" class="link" rel="noopener noreferrer">【官方网站】</a>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
    // 引入Bmob
    import Bmob from "hydrogen-js-sdk";
    // 初始化SDK
    Bmob.initialize(
        "6ba991ef4d1c12f7bf1e5b61ee05bb60",
        "47e0f6cf681a9d51ca2fea06cdead1d0"
    );
    export default {
        name: "Friendship",
        //import引入的组件需要注入到对象中才能使用
        components: {},
        data() {
            //这里存放数据
            return {
                loading: true,
                DataList: []
            };
        },
        created() {
            this.GetList(100);
        },
        //方法集合
        methods: {
            // 获取友情链接数据
            GetList(e) {
                const query = Bmob.Query("Blog_Friendship");
                query.limit(e);
                query.order("createdAt");
                query.find().then(res => {
                    this.DataList = res;
                    this.loading = false;
                });
            }
        }
    };
</script>
<style  scoped>
.loading {
    text-align: center;
    padding-top: 20%;
    position: absolute;
    display: block;
    width: 80%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.5);
}
.contenr {
    padding-left: 260px;
    box-sizing: border-box;
    width: 100%;
}
.Friendshipimg {
    border-radius: 10px;
    /* border: 1px solid #000; */
    box-shadow: 0 4px 14px 0 rgba(0, 0, 0, 0.1);
}
.Friendship {
    /* display: flex; */
    margin: 0 auto;
    max-width: 80%;
    /* height: 200px; */
    min-height: 900px;
    background-color: rgb(251, 251, 251);
}
.logobox {
    float: left;
    min-height: 200px;
    height: 400px;
    width: 25%;
    padding: 15px;
    box-sizing: border-box;
}
.logobox > img {
    display: block;
    width: 60%;
    margin: 0 auto;
    margin-bottom: 10px;
}
.logobox > h5 {
    text-align: center;
}
.logobox > p {
    margin-top: 10px;
    text-indent: 2em;
}
.logobox > .linkbox {
    width: 100%;
    text-indent: 0em;
    text-align: center;
}
.link {
    color: #469b6e;
}
</style>