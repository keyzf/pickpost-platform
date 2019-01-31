'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const collectionSchema = new Schema({
    name: { type: String },
    desc: { type: String },
    auth: { type: String },
    public: { type: Boolean },
    owners: { type: Array },
    members: { type: Array },
    envs: { type: Array },
    accounts: { type: Array },
    spaceId: { type: String },
    parentId: { type: String },
    type: { type: String }, // file or folder
  }, {
    timestamps: true,
  });

  return mongoose.model('Collection', collectionSchema);
};
