const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  const blogObjects = helper.blogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned with GET', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.blogs.length)
})

test('all blogs have an id property', async () => {
  const response = await api.get('/api/blogs')
  for (const blog of response.body) {
    expect(blog.id).toBeDefined()
  }
})

test('POST request creates a new blog', async () => {
  const newBlog = {
    title: 'Hello World',
    author: 'Jose',
    url: 'Test',
    likes: 3
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  let blogs = await Blog.find({})
  blogs = blogs.map(blog => blog.toJSON())

  expect(blogs).toHaveLength(helper.blogs.length + 1)

  const titles = blogs.map(n => n.title)

  expect(titles).toContain(
    'Hello World'
  )
})

test('The likes property of a blog a default of 0', async () => {
  const newBlog = {
    title: 'Hello World',
    author: 'Jose',
    url: 'Test'
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)

  expect(response.body.likes).toBe(0)
})

test('blog without title is not added', async () => {
  const newBlog = {
    author: 'Jose',
    url: 'Test'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  let blogs = await Blog.find({})
  blogs = blogs.map(blog => blog.toJSON())

  expect(blogs).toHaveLength(helper.blogs.length)
})

test('blog without url is not added', async () => {
  const newBlog = {
    title: 'Hello World',
    author: 'Jose',
    likes: 3
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  let blogs = await Blog.find({})
  blogs = blogs.map(blog => blog.toJSON())

  expect(blogs).toHaveLength(helper.blogs.length)
})

afterAll(() => {
  mongoose.connection.close()
})
