import { useState } from 'react'

function PostCard({ post }) {
  const [meGusta, setMeGusta] = useState(0)

  return (
    <article className="post-card">
      <span className="post-tag">{post.categoria}</span>
      <h2>{post.titulo}</h2>
      <p>{post.resumen}</p>
      <button
        className="like-btn"
        onClick={() => setMeGusta(meGusta + 1)}
        aria-label={`Me gusta este post, ${meGusta} personas ya dieron me gusta`}
      >
        Me gusta ({meGusta})
      </button>
    </article>
  )
}

export default PostCard