* <a href="https://stackoverflow.com/questions/26156687/mongoose-find-update-subdocument" rel="noopener noreferrer">updating an item inside a model's Array of subdocuments</a>
```js
const { word } = req.body; // "something"
const wordsUpdate = await User.findOneAndUpdate(
  {//filter
    user: req.user.id,
    'words._id': req.body._id, //filter to one subdocument to update by some value or by _id
  },
  {//update
    $set: { 'words.$.word': word }, //set the values of one or more of the filter matched subdocument's properties
  },
  {//options
    new: true,
  }
);
//wordsUpdate === { _id: "user ID here", words: [{ word: "something", _id: ... }]}
```