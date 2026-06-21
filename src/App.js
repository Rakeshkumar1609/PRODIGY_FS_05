import { useState } from 'react';
import './App.css';

function makePoster(title, accentA, accentB, caption) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 560" role="img" aria-label="${title}">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${accentA}" />
          <stop offset="100%" stop-color="${accentB}" />
        </linearGradient>
        <radialGradient id="glow" cx="30%" cy="20%" r="80%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.45" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="800" height="560" rx="36" fill="url(#bg)" />
      <circle cx="630" cy="120" r="160" fill="url(#glow)" />
      <circle cx="170" cy="410" r="130" fill="#0f172a" opacity="0.16" />
      <path d="M0 420C140 340 250 330 380 390C500 445 640 456 800 360V560H0Z" fill="#08111f" opacity="0.26" />
      <text x="56" y="112" fill="rgba(255,255,255,0.72)" font-family="Arial, sans-serif" font-size="26" letter-spacing="3">PULSEBOARD</text>
      <text x="56" y="228" fill="#ffffff" font-family="Arial, sans-serif" font-size="72" font-weight="700">${title}</text>
      <text x="56" y="286" fill="rgba(255,255,255,0.86)" font-family="Arial, sans-serif" font-size="28">${caption}</text>
      <rect x="56" y="338" width="228" height="58" rx="29" fill="rgba(255,255,255,0.2)" />
      <text x="90" y="376" fill="#ffffff" font-family="Arial, sans-serif" font-size="24">Live social story</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const currentUserSeed = {
  name: 'Kartik',
  handle: '@avery',
  role: 'Creator / product storyteller',
  bio: 'Building expressive products, publishing notes, and curating thoughtful communities.',
  followers: 18240,
  following: 246,
  posts: 38,
};

const initialSuggestions = [
  {
    id: 101,
    name: 'Maya',
    handle: '@maya',
    role: 'Motion designer',
    followers: '14.8K followers',
  },
  {
    id: 102,
    name: 'Joe',
    handle: '@joe',
    role: 'Community builder',
    followers: '9.4K followers',
  },
  {
    id: 103,
    name: 'Surya',
    handle: '@surya',
    role: 'Startup operator',
    followers: '22.1K followers',
  },
];

const initialPosts = [
  {
    id: 1,
    authorId: 101,
    authorName: 'Maya',
    authorHandle: '@maya',
    role: 'Motion designer',
    timeAgo: '8 min ago',
    text: 'Turned a rooftop timelapse into a quick reel for the launch campaign. The gradient overlays and beat sync made it feel alive.',
    tags: ['motion', 'video', 'creative'],
    media: {
      type: 'video',
      src: '',
      poster: makePoster('Rooftop Reel', '#ff8a00', '#ff3d77', 'A short campaign cut with layered motion and sound design.'),
      playable: false,
    },
    likeCount: 184,
    likedByMe: false,
    comments: [
      {
        id: 11,
        author: 'Nina',
        text: 'The pacing is sharp. The color treatment carries it.',
        timeAgo: '5 min ago',
      },
    ],
  },
  {
    id: 2,
    authorId: 102,
    authorName: 'Joe',
    authorHandle: '@joe',
    role: 'Community builder',
    timeAgo: '27 min ago',
    text: 'Mapped the neighborhood launch route so residents can see pop-up events, volunteer stops, and live updates in one view.',
    tags: ['design', 'community', 'launch'],
    media: {
      type: 'image',
      src: makePoster('Neighborhood Map', '#39c6ff', '#6d4bff', 'A visual roadmap for an active community launch weekend.'),
    },
    likeCount: 96,
    likedByMe: true,
    comments: [
      {
        id: 21,
        author: 'Avery',
        text: 'This is a great pattern for event discovery.',
        timeAgo: '19 min ago',
      },
      {
        id: 22,
        author: 'Sana',
        text: 'Love the way the route logic feels simple.',
        timeAgo: '12 min ago',
      },
    ],
  },
  {
    id: 3,
    authorId: 103,
    authorName: 'Surya',
    authorHandle: '@surya',
    role: 'Startup operator',
    timeAgo: '1 hr ago',
    text: 'Finished the first pass of a food truck finder with live status, savings badges, and one-tap ordering cues.',
    tags: ['startup', 'product', 'ux'],
    media: {
      type: 'image',
      src: makePoster('Food Truck Finder', '#2ad38b', '#0b7285', 'Launch-ready product polish for busy communities on the move.'),
    },
    likeCount: 247,
    likedByMe: false,
    comments: [
      {
        id: 31,
        author: 'Maya',
        text: 'The status cues make the experience feel much calmer.',
        timeAgo: '44 min ago',
      },
    ],
  },
];

function App() {
  const [profile, setProfile] = useState(currentUserSeed);
  const [profileDraft, setProfileDraft] = useState({
    name: currentUserSeed.name,
    bio: currentUserSeed.bio,
  });
  const [posts, setPosts] = useState(initialPosts);
  const suggestions = initialSuggestions;
  const [followingIds, setFollowingIds] = useState([102]);
  const [activeTag, setActiveTag] = useState('All posts');
  const [composerText, setComposerText] = useState('');
  const [composerTags, setComposerTags] = useState('launch, design');
  const [composerMedia, setComposerMedia] = useState(null);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Maya liked your launch note',
      detail: 'Engagement is up 18% this week.',
      timeAgo: '2 min ago',
    },
    {
      id: 2,
      title: 'New follower from the design cohort',
      detail: 'Your profile was added to three circles.',
      timeAgo: '14 min ago',
    },
  ]);
  const [commentDrafts, setCommentDrafts] = useState({});

  const createNotification = (title, detail) => {
    setNotifications((current) => [
      {
        id: Date.now() + Math.random(),
        title,
        detail,
        timeAgo: 'Just now',
      },
      ...current,
    ].slice(0, 5));
  };

  const normalizeTags = (value) =>
    value
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
      .map((tag) => tag.replace(/^#/, '').toLowerCase());

  const filteredPosts =
    activeTag === 'All posts'
      ? posts
      : posts.filter((post) => post.tags.some((tag) => `#${tag}` === activeTag || tag === activeTag.replace(/^#/, '')));

  const tagCounts = posts.reduce((accumulator, post) => {
    post.tags.forEach((tag) => {
      accumulator[tag] = (accumulator[tag] || 0) + 1;
    });

    return accumulator;
  }, {});

  const trendingTags = Object.entries(tagCounts)
    .sort((left, right) => right[1] - left[1])
    .slice(0, 5)
    .map(([tag, count]) => ({ tag: `#${tag}`, count }));

  const topCreators = suggestions.map((creator) => {
    const totalEngagement = posts.reduce((sum, post) => {
      return post.authorId === creator.id ? sum + post.likeCount + post.comments.length : sum;
    }, 0);

    return { ...creator, totalEngagement };
  });

  const handleProfileSave = (event) => {
    event.preventDefault();

    const name = profileDraft.name.trim();
    const bio = profileDraft.bio.trim();

    if (!name || !bio) {
      return;
    }

    setProfile((current) => ({
      ...current,
      name,
      bio,
    }));
    createNotification('Profile updated', 'Your creator profile is now live.');
  };

  const handleMediaChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setComposerMedia(null);
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setComposerMedia({
        name: file.name,
        type: file.type.startsWith('video/') ? 'video' : 'image',
        src: reader.result,
      });
    };

    reader.readAsDataURL(file);
  };

  const handleSubmitPost = (event) => {
    event.preventDefault();

    const content = composerText.trim();
    const tags = normalizeTags(composerTags);

    if (!content && !composerMedia && tags.length === 0) {
      return;
    }

    const nextPost = {
      id: Date.now(),
      authorId: 999,
      authorName: profile.name,
      authorHandle: profile.handle,
      role: profile.role,
      timeAgo: 'Just now',
      text: content || 'Shared a visual-first update.',
      tags: tags.length > 0 ? tags : ['update'],
      media: composerMedia,
      likeCount: 0,
      likedByMe: false,
      comments: [],
    };

    setPosts((current) => [nextPost, ...current]);
    setProfile((current) => ({
      ...current,
      posts: current.posts + 1,
    }));
    setComposerText('');
    setComposerTags('');
    setComposerMedia(null);
    createNotification('Post published', 'Your new update is now in the feed.');
  };

  const toggleLike = (postId) => {
    setPosts((current) =>
      current.map((post) => {
        if (post.id !== postId) {
          return post;
        }

        const likedByMe = !post.likedByMe;

        if (likedByMe && post.authorId !== 999) {
          createNotification(`You liked ${post.authorName}'s post`, 'The creator will see the boost right away.');
        }

        return {
          ...post,
          likedByMe,
          likeCount: post.likeCount + (likedByMe ? 1 : -1),
        };
      })
    );
  };

  const submitComment = (postId) => {
    const draft = commentDrafts[postId]?.trim();

    if (!draft) {
      return;
    }

    setPosts((current) =>
      current.map((post) => {
        if (post.id !== postId) {
          return post;
        }

        const nextComment = {
          id: Date.now() + Math.random(),
          author: profile.name,
          text: draft,
          timeAgo: 'Just now',
        };

        return {
          ...post,
          comments: [nextComment, ...post.comments],
        };
      })
    );

    setCommentDrafts((current) => ({
      ...current,
      [postId]: '',
    }));
    createNotification('Comment sent', 'Your reply is now part of the conversation.');
  };

  const toggleFollow = (creatorId, creatorName) => {
    setFollowingIds((current) => {
      const isFollowing = current.includes(creatorId);
      const nextFollowing = isFollowing ? current.filter((id) => id !== creatorId) : [...current, creatorId];

      createNotification(
        isFollowing ? `Unfollowed ${creatorName}` : `Following ${creatorName}`,
        isFollowing ? 'You removed this creator from your network.' : 'New updates from this creator will appear in your feed.'
      );

      return nextFollowing;
    });
  };

  const resetTagFilter = () => setActiveTag('All posts');

  const initials = profile.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('');

  return (
    <div className="app-shell">
      <aside className="sidebar sidebar--left">
        <div className="panel profile-panel">
          <div className="brand-row">
            <div className="brand-mark">PB</div>
            <div>
              <p className="eyebrow">Social studio</p>
              <h1>PulseBoard</h1>
            </div>
          </div>

          <div className="profile-hero">
            <div className="avatar avatar--large">{initials}</div>
            <div>
              <h2>{profile.name}</h2>
              <p>{profile.handle}</p>
            </div>
          </div>

          <p className="profile-bio">{profile.bio}</p>

          <div className="stats-grid">
            <div>
              <strong>{profile.posts}</strong>
              <span>Posts</span>
            </div>
            <div>
              <strong>{profile.followers.toLocaleString()}</strong>
              <span>Followers</span>
            </div>
            <div>
              <strong>{profile.following.toLocaleString()}</strong>
              <span>Following</span>
            </div>
          </div>
        </div>

        <form className="panel composer-panel profile-form" onSubmit={handleProfileSave}>
          <div className="section-heading">
            <div>
              <p className="eyebrow">Profile setup</p>
              <h3>Create your profile</h3>
            </div>
          </div>

          <label>
            Display name
            <input
              value={profileDraft.name}
              onChange={(event) => setProfileDraft((current) => ({ ...current, name: event.target.value }))}
              placeholder="Your display name"
            />
          </label>

          <label>
            Bio
            <textarea
              rows="4"
              value={profileDraft.bio}
              onChange={(event) => setProfileDraft((current) => ({ ...current, bio: event.target.value }))}
              placeholder="Tell people what you build or care about"
            />
          </label>

          <button className="primary-button" type="submit">
            Save profile
          </button>
        </form>

        <div className="panel trending-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Trending content</p>
              <h3>Explore topics</h3>
            </div>
            <button className="ghost-button" type="button" onClick={resetTagFilter}>
              Clear filter
            </button>
          </div>

          <div className="tag-cloud">
            <button
              className={`tag-chip ${activeTag === 'All posts' ? 'tag-chip--active' : ''}`}
              type="button"
              onClick={() => setActiveTag('All posts')}
            >
              All posts
            </button>
            {trendingTags.map((trend) => (
              <button
                key={trend.tag}
                className={`tag-chip ${activeTag === trend.tag ? 'tag-chip--active' : ''}`}
                type="button"
                onClick={() => setActiveTag(trend.tag)}
              >
                {trend.tag}
                <span>{trend.count}</span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      <main className="feed-column">
        <section className="hero panel">
          <div className="hero-copy">
            <p className="eyebrow">Create. Share. Respond.</p>
            <h2>A social feed built for profiles, posts, media, tags, and fast community feedback.</h2>
            <p>
              Publish updates with image or video attachments, tag your content to surface the right audience, and keep the conversation moving with likes, comments, follows, and live notifications.
            </p>

            <div className="hero-actions">
              <button className="primary-button" type="button" onClick={() => document.getElementById('composer')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
                Start a post
              </button>
              <button className="ghost-button" type="button" onClick={() => setActiveTag('#design')}>
                Highlight design posts
              </button>
            </div>
          </div>

          <div className="hero-card">
            <div className="hero-card__metric">
              <strong>24.8K</strong>
              <span>Engagement today</span>
            </div>
            <div className="hero-card__metric">
              <strong>128</strong>
              <span>New reactions</span>
            </div>
            <div className="hero-card__metric">
              <strong>18</strong>
              <span>Trending tags</span>
            </div>
          </div>
        </section>

        <section className="panel composer-panel" id="composer">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Composer</p>
              <h3>Share a post</h3>
            </div>
            <span className="status-pill">Image and video upload ready</span>
          </div>

          <form className="composer-form" onSubmit={handleSubmitPost}>
            <label>
              Post text
              <textarea
                rows="5"
                value={composerText}
                onChange={(event) => setComposerText(event.target.value)}
                placeholder="Tell your followers what you are building, launching, or celebrating..."
              />
            </label>

            <div className="composer-grid">
              <label>
                Tags
                <input
                  value={composerTags}
                  onChange={(event) => setComposerTags(event.target.value)}
                  placeholder="design, launch, behind-the-scenes"
                />
              </label>

              <label>
                Upload media
                <input type="file" accept="image/*,video/*" onChange={handleMediaChange} />
              </label>
            </div>

            {composerMedia ? (
              <div className="media-preview">
                <div className="media-preview__header">
                  <span>{composerMedia.name}</span>
                  <button className="ghost-button" type="button" onClick={() => setComposerMedia(null)}>
                    Remove
                  </button>
                </div>

                {composerMedia.type === 'image' ? (
                  <img className="media-preview__asset" src={composerMedia.src} alt={composerMedia.name} />
                ) : (
                  <video className="media-preview__asset" controls src={composerMedia.src} />
                )}
              </div>
            ) : null}

            <div className="composer-footer">
              <p>
                Add rich context, links, or a visual story. Your post will show instantly in the feed.
              </p>
              <button className="primary-button" type="submit">
                Publish post
              </button>
            </div>
          </form>
        </section>

        <section className="feed-header">
          <div>
            <p className="eyebrow">Feed</p>
            <h3>{activeTag === 'All posts' ? 'Top conversations right now' : `Posts tagged ${activeTag}`}</h3>
          </div>
          <span className="status-pill">{filteredPosts.length} posts visible</span>
        </section>

        <section className="feed-list">
          {filteredPosts.map((post) => {
            const isFollowing = followingIds.includes(post.authorId);

            return (
              <article className="panel post-card" key={post.id}>
                <div className="post-card__header">
                  <div className="author-block">
                    <div className="avatar">{post.authorName.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div>
                    <div>
                      <h4>{post.authorName}</h4>
                      <p>
                        {post.authorHandle} · {post.role} · {post.timeAgo}
                      </p>
                    </div>
                  </div>

                  {post.authorId !== 999 ? (
                    <button className="ghost-button" type="button" onClick={() => toggleFollow(post.authorId, post.authorName)}>
                      {isFollowing ? 'Following' : 'Follow'}
                    </button>
                  ) : null}
                </div>

                <p className="post-copy">{post.text}</p>

                <div className="tag-row">
                  {post.tags.map((tag) => (
                    <button key={tag} className="tag-chip tag-chip--inline" type="button" onClick={() => setActiveTag(`#${tag}`)}>
                      #{tag}
                    </button>
                  ))}
                </div>

                {post.media ? (
                  post.media.type === 'image' ? (
                    <img className="post-media" src={post.media.src} alt={`${post.authorName} post media`} />
                  ) : post.media.src ? (
                    <video className="post-media" controls src={post.media.src} />
                  ) : (
                    <div className="post-media post-media--poster" style={{ backgroundImage: `url(${post.media.poster})` }}>
                      <div className="post-media__overlay">
                        <span className="play-button">▶</span>
                        <strong>Video story</strong>
                        <p>Tap upload previews to play the clip.</p>
                      </div>
                    </div>
                  )
                ) : null}

                <div className="post-actions">
                  <button className={`action-button ${post.likedByMe ? 'action-button--active' : ''}`} type="button" onClick={() => toggleLike(post.id)}>
                    ♥ {post.likeCount}
                  </button>
                  <span className="action-button action-button--static">💬 {post.comments.length}</span>
                  <span className="action-button action-button--static">↗ Share</span>
                </div>

                <div className="comments-block">
                  <div className="comments-block__header">
                    <strong>Comments</strong>
                    <span>{post.comments.length} responses</span>
                  </div>

                  <div className="comment-list">
                    {post.comments.map((comment) => (
                      <div className="comment-item" key={comment.id}>
                        <div className="comment-item__avatar">{comment.author.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div>
                        <div>
                          <strong>{comment.author}</strong>
                          <p>{comment.text}</p>
                          <span>{comment.timeAgo}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="comment-form">
                    <input
                      value={commentDrafts[post.id] || ''}
                      onChange={(event) =>
                        setCommentDrafts((current) => ({
                          ...current,
                          [post.id]: event.target.value,
                        }))
                      }
                      placeholder="Write a thoughtful reply"
                    />
                    <button className="primary-button" type="button" onClick={() => submitComment(post.id)}>
                      Comment
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </main>

      <aside className="sidebar sidebar--right">
        <div className="panel notifications-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Notifications</p>
              <h3>Activity center</h3>
            </div>
          </div>

          <div className="notification-list">
            {notifications.map((notification) => (
              <div className="notification-item" key={notification.id}>
                <strong>{notification.title}</strong>
                <p>{notification.detail}</p>
                <span>{notification.timeAgo}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel creators-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Suggestions</p>
              <h3>People to follow</h3>
            </div>
          </div>

          <div className="creator-list">
            {topCreators.map((creator) => {
              const isFollowing = followingIds.includes(creator.id);

              return (
                <div className="creator-card" key={creator.id}>
                  <div className="creator-card__info">
                    <div className="avatar avatar--small">{creator.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div>
                    <div>
                      <strong>{creator.name}</strong>
                      <p>{creator.handle}</p>
                      <span>{creator.followers}</span>
                    </div>
                  </div>
                  <button className="ghost-button" type="button" onClick={() => toggleFollow(creator.id, creator.name)}>
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="panel insights-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Insights</p>
              <h3>Trending creators</h3>
            </div>
          </div>

          <div className="insight-list">
            {topCreators.map((creator) => (
              <div className="insight-item" key={creator.id}>
                <span>{creator.name}</span>
                <strong>{creator.totalEngagement}</strong>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

export default App;
