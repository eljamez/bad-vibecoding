import { prisma } from '@/lib/prisma';

export default async function TestDbPage() {
  let users = [];
  let posts = [];
  let error = null;

  try {
    // Fetch users and posts from the database
    users = await prisma.user.findMany({
      include: {
        posts: true,
      },
    });

    posts = await prisma.post.findMany({
      include: {
        author: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch (e) {
    error = e instanceof Error ? e.message : 'Unknown error';
    console.error('Database error:', e);
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Database Connection Test</h1>

        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
            <strong>Error connecting to database:</strong>
            <p className="mt-2">{error}</p>
            <p className="mt-4 text-sm">
              Make sure you have:
              <ol className="list-decimal ml-6 mt-2">
                <li>Created a .env file with your DATABASE_URL</li>
                <li>Run <code className="bg-red-200 px-1 rounded">npm run prisma:generate</code></li>
                <li>Run <code className="bg-red-200 px-1 rounded">npm run prisma:migrate</code></li>
              </ol>
            </p>
          </div>
        ) : (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-8">
            ✅ Successfully connected to the database!
          </div>
        )}

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Users ({users.length})</h2>
            {users.length === 0 ? (
              <p className="text-gray-600">No users found. Create one using the API:</p>
            ) : (
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg">{user.name || 'Unnamed User'}</h3>
                    <p className="text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Posts: {user.posts.length} | Joined: {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <p className="text-sm font-mono">
                POST /api/users
              </p>
              <pre className="text-xs mt-2 overflow-x-auto">
{`{
  "email": "user@example.com",
  "name": "John Doe"
}`}
              </pre>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Posts ({posts.length})</h2>
            {posts.length === 0 ? (
              <p className="text-gray-600">No posts found. Create one using the API:</p>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg">{post.title}</h3>
                    <p className="text-gray-700 mt-2">{post.content}</p>
                    <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                      <span>By: {post.author.name || post.author.email}</span>
                      <span>•</span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span className={post.published ? 'text-green-600' : 'text-orange-600'}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <p className="text-sm font-mono">
                POST /api/posts
              </p>
              <pre className="text-xs mt-2 overflow-x-auto">
{`{
  "title": "My First Post",
  "content": "This is my first post content.",
  "authorId": "user_id_here",
  "published": true
}`}
              </pre>
            </div>
          </section>
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
          <h3 className="font-semibold mb-2">API Endpoints Available:</h3>
          <ul className="space-y-1 text-sm">
            <li><code className="bg-blue-100 px-2 py-1 rounded">GET /api/users</code> - Fetch all users</li>
            <li><code className="bg-blue-100 px-2 py-1 rounded">POST /api/users</code> - Create a new user</li>
            <li><code className="bg-blue-100 px-2 py-1 rounded">GET /api/posts</code> - Fetch all posts</li>
            <li><code className="bg-blue-100 px-2 py-1 rounded">POST /api/posts</code> - Create a new post</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

