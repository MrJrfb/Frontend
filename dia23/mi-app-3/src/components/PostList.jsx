import PostCard from './PostCard'

function PostList({ posts }) {
  if (posts.length === 0) {
    return (
      <section className="post-list">
        <p>No hay publicaciones en esta categoria.</p>
      </section>
    )
  }

  return (
    <section className="post-list" aria-label="Lista de publicaciones">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </section>
  )
}

export default PostList