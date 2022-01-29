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

* <a href="https://stackoverflow.com/questions/48385869/mongoose-remove-subdocument-from-array" rel="noopener noreferrer">Remove subdocument from model's array</a>
```js
    // Get the user from database
    const user = await User.findById(req.user._id);

    // Use the function filter to remove every user
    // matching the date in weightInstance
    user.weights = user.weights.filter(x => x.date !== weightInstance.date);

    // Save the modified user
    await user.save();
```