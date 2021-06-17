import { useRouter } from "next/router";
import React, { useEffect, useState, useContext } from "react";
import Posts from "../../components/Posts"
import SubNav from "../../components/SubNav"


const PostPage = ({ posts }) => {



    return (
        <><Posts posts={posts}></Posts>

        </>)
}

export async function getStaticPaths() {
    // Call an external API endpoint to get posts
    const res = await fetch('https://quiet-peak-00993.herokuapp.com/posts')
    const posts = await res.json()

    // Get the paths we want to pre-render based on posts
    const paths = posts.data.map((post, id) => {

        //start our paths at page 1 not 0;
        id = id + 1;
        return {
            params: { id: id.toString() }

        }
    })

    // We'll pre-render only these paths at build time.
    // { fallback: false } means other routes should 404.
    return { paths, fallback: false }
}

export async function getStaticProps({ params }) {

    console.log('params', params)
    // params contains the post `id`.
    // If the route is like /posts/1, then params.id is 1
    const res = await fetch(`https://quiet-peak-00993.herokuapp.com/posts/${params.id}`)
    const posts = await res.json()



    // Pass post data to the page via props
    return { props: { posts } }
}

export default PostPage;