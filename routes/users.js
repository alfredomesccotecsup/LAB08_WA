const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Joi = require('joi');

const router = express.Router();

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

const User = mongoose.model('User', userSchema);

const userValidationSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

router.get('/', async (req, res) => {
  const users = await User.find();
  res.render('index', { users });
});

router.get('/listar-usuarios', async (req, res) => {
  const users = await User.find();
  res.render('listar-usuarios', { users });
});

router.get('/crear-usuario', (req, res) => {
  res.render('crear-usuario');
});


router.post('/', async (req, res) => {
  const { name, email, password } = req.body;

  const { error } = userValidationSchema.validate({ name, email, password });

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    name,
    email,
    password: hashedPassword
  });

  try {
    await newUser.save();
    res.redirect('/users');
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    res.status(500).send('Error al crear el usuario');
  }
});

router.get('/edit/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  res.render('partials/edit', { user });
});

router.post('/update/:id', async (req, res) => {
  const { name, email, password } = req.body;
  const userId = req.params.id;

  try {
    let updateData = {
      name,
      email
    };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    await User.findByIdAndUpdate(userId, updateData);

    res.redirect('/users');
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).send('Error al actualizar el usuario');
  }
});



router.get('/delete/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.redirect('/users');
});

module.exports = router;
