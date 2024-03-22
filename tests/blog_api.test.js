const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)
const testBlogs = require('./testdata')
const helper = require('./test_helper')
const User = require('../models/user')
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(testBlogs)

    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
})

describe('viewing blogs', () => {
    test('blogs are returned as json', async () => {
        await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(testBlogs.length)
    })

    test('blogs have id field', async () => {
        const response = await api.get('/api/blogs')
        const ids = response.body.map(r => r.id)
        console.log(ids)
        for(id of ids) {
            console.log(id)
            expect(id).toBeDefined()
        }
    })
})

describe('adding a blog', () => {
    test('a valid blog can be added ', async () => {
        const usersAtStart = await helper.usersInDb()
        const user = usersAtStart[0]

        const userForToken = {
            username: user.username,
            id: user.id,
        }

        const token1 = jwt.sign(userForToken, process.env.SECRET)

        const newBlog = {
            title: "Kukkuu",
            author: "Joku Vaan",
            url: "https://hehee.com/",
            likes: 4,
            user: user.id
        }

        await api
            .post('/api/blogs')
            .auth(token1, { type: 'bearer' })
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(testBlogs.length + 1)

        const titles = blogsAtEnd.map(b => b.title)
        expect(titles).toContain(
            'Kukkuu'
        )
    })

    test('if no likes, then 0 likes', async () => {
        const usersAtStart = await helper.usersInDb()
        const user = usersAtStart[0]

        const userForToken = {
            username: user.username,
            id: user.id,
        }

        const token1 = jwt.sign(userForToken, process.env.SECRET)

        const newBlog = {
            title: "Kukkuu",
            author: "Joku Vaan",
            url: "https://hehee.com/",
            user: user.id
        }

        await api
            .post('/api/blogs')
            .auth(token1, { type: 'bearer' })
            .send(newBlog)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd[blogsAtEnd.length -1].likes).toBe(0)
    })


    test('blog without title or url is not added', async () => {
        const usersAtStart = await helper.usersInDb()
        const user = usersAtStart[0]

        const userForToken = {
            username: user.username,
            id: user.id,
        }

        const token1 = jwt.sign(userForToken, process.env.SECRET)

        const newBlog = 
            {
                title: "Moimoi",
                author: "Hilla Hilperi",
                likes: 4,
                user: user.id
            } 

        await api
            .post('/api/blogs')
            .auth(token1, { type: 'bearer' })
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(testBlogs.length)
    })

    test('blog adding request without token returns correct statuscode', async () => {
        const newBlog = {
            title: "Kukkuu",
            author: "Joku Vaan",
            url: "https://hehee.com/",
            likes: 4
        }

        await api
            .post('/api/blogs')
            .auth()
            .send(newBlog)
            .expect(401)
    })
})

describe('modifying a blog', () => {
    test('blog likes can be modified', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToModify = blogsAtStart[0]

        const blog = {
            likes: 40
        }

        await api
          .put(`/api/blogs/${blogToModify.id}`)
          .send(blog)
          .expect(200)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd[0].likes).toBe(40)
    })
})

describe('deleting a blog', () => {
    test('blog delete succeeds with status code 204 if id is valid', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(
        testBlogs.length - 1
        )

        const titles = blogsAtEnd.map(r => r.title)

        expect(titles).not.toContain(blogToDelete.title)
    })
})

afterAll(async () => {
  await mongoose.connection.close()
})