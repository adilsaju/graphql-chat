// const Job = require('../models/JobModel.js');
const express = require('express');
const job = require('../models/userModel')

const test = async (req, res, next) => {
  // console.log("login");

  // res.json("login")
  console.log("success");
  res.json("success")

};

module.exports = {
  test,


}