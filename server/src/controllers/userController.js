const express = require("express");
const User = require("../models/userModel");
const { uploadImageToCloudinary } = require("../utils/upload");

exports.profile = async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (error) {
    console.log(error);
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user;
    const isAllowed = ["age", "gender", "bio", "profilePic", "caption","username"];

    const allowedUpdate = {};

    Object.keys(req.body).forEach((key) => {
      if (isAllowed.includes(key)) {
        allowedUpdate[key] = req.body[key];
      }
    });

    if (req.file) {
      try {
        const cloudinaryUrl = await uploadImageToCloudinary(req.file, "love_mate_profile_pics");  
        allowedUpdate.profilePic = cloudinaryUrl;  
      } catch (error) {
        return res.status(500).json({ msg: "Failed to upload image to Cloudinary." });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(userId, allowedUpdate, {
      new: true,
    });
    res.status(200).json({
      msg: "user updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error while updating profile" });

  }
};


exports.getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.error("Error getting single user:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.searchUsersByName = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ msg: "Please provide a name to search" });
    }

    const regex = new RegExp("^" + name, "i");

    const users = await User.find({
      username: { $regex: regex },
      _id: { $ne: req.user },
    }).select("username age gender profilePic");

    res.status(200).json(users);
  } catch (error) {
    console.error("Live search error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};



// exports.allUser = async (req, res) => {
//   try {
//     const currentId = req.user;
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     const currentUser = await User.findById(currentId).select("sentInterests receivedInterests matchedUsers");

//     const excludedIds = [
//       ...currentUser.sentInterests,
//       ...currentUser.receivedInterests,
//       ...currentUser.matchedUsers,
//       currentId,
//     ];

//     const filter = {
//       _id: { $nin: excludedIds }
//     };
    
//     const total = await User.countDocuments(filter);
//     const users = await User.find(filter)
//       .skip(skip)
//       .limit(limit)
//       .select("-password");


//       console.log(filter,"filter")
//     console.log("Excluded IDs:", excludedIds);
//     console.log("Filtered Users:", users.length);
//     res.status(200).json({
//       users,
//       currentPage: page,
//       totalPages: Math.ceil(total / limit),
//       totalUsers: total,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: "Server error while fetching users" });
//   }
// };


// exports.allUser = async (req, res) => {
//   try {
//     const currentId = req.user;
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     const currentUser = await User.findById(currentId).select("sentInterests receivedInterests matchedUsers potentialMatches");
   
//     const excludedIds = [
//       ...currentUser.sentInterests,
//       ...currentUser.receivedInterests,
//       ...currentUser.matchedUsers,
//       currentId,
//     ];
//     const filter = {
//       $or: [
       
//         { _id: { $in: currentUser.potentialMatches } },
      
//         { _id: { $nin: excludedIds } }
//       ]
//     };

//     const total = await User.countDocuments(filter);
//     const users = await User.find(filter)
//       .skip(skip)
//       .limit(limit)
//       .select("-password");

   
//     console.log("Filtered Users:", users.length);

//     res.status(200).json({
//       users,
//       currentPage: page,
//       totalPages: Math.ceil(total / limit),
//       totalUsers: total,
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: "Server error while fetching users" });
//   }
// };




exports.allUser = async (req, res) => {
  try {
    const currentId = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const currentUser = await User.findById(currentId).select(
      "sentInterests receivedInterests matchedUsers potentialMatches gender"
    );

    const excludedIds = [
      ...currentUser.sentInterests,
      ...currentUser.receivedInterests,
      ...currentUser.matchedUsers,
      currentId,
    ];

    const oppositeGender = currentUser.gender === "Male" ? "Female" : "Male";

    let users = await User.find({
      _id: { $in: currentUser.potentialMatches, $nin: excludedIds },
      gender: oppositeGender,
    })
      .skip(skip)
      .limit(limit)
      .select("-password");

    if (users.length < limit) {
      const remaining = limit - users.length;

      const additionalUsers = await User.find({
        _id: {
          $nin: [
            ...excludedIds,
            ...users.map((u) => u._id),
          ],
        },
        gender: oppositeGender,
      })
        .skip(Math.max(0, skip - currentUser.potentialMatches.length))
        .limit(remaining)
        .select("-password");

      users = [...users, ...additionalUsers];
    }

    const total = await User.countDocuments({
      _id: { $nin: excludedIds },
      gender: oppositeGender,
    });

    res.status(200).json({
      users,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalUsers: total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error while fetching users" });
  }
};





// exports.allUser = async (req, res) => {
//   try {
//     const currentId = req.user;
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     const currentUser = await User.findById(currentId).select(
//       "sentInterests receivedInterests matchedUsers potentialMatches"
//     );

//     // Collect all excluded user IDs
//     const excludedIds = [
//       ...currentUser.sentInterests,
//       ...currentUser.receivedInterests,
//       ...currentUser.matchedUsers,
//       currentId,
//     ];

//     // Exclude users already interacted with
//     const filter = {
//       _id: {
//         $nin: excludedIds,
//       },
//     };

//     const total = await User.countDocuments(filter);

//     const users = await User.find(filter)
//       .skip(skip)
//       .limit(limit)
//       .select("-password");

//     console.log("Filtered Users Count:", users.length);

//     res.status(200).json({
//       users,
//       currentPage: page,
//       totalPages: Math.ceil(total / limit),
//       totalUsers: total,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: "Server error while fetching users" });
//   }
// };
