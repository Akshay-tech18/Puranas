const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
    const allowedVideoTypes = /mp4|avi|mov|wmv|flv|mkv/;
    const allowedAudionTypes = /mp3|wav|ogg|m4a/;

    const extname = path.extname(file.originalname).toLowerCase().slice(1);
    const mimetype = file.mimetype;

    const isImage = allowedImageTypes.test(extname) && mimetype.startsWith('image/');
    const isVideo = allowedImageTypes.test(extname) && mimetype.startsWith('video/');
    const isAudio = allowedImageTypes.test(extname) && mimetype.startsWith('audio/');

    if(isImage || isVideo || isAudio) {
        cb(null, true);
    }else{
        cb(new Error('Invalid file type. only images, videos and audio files are allowed.'));
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50mb max size
    },
    fileFilter: fileFilter,
});

// upload media files
//post /api/media/upload

const uploadMedia = async(req, res, next) => {
    try{
        if(!req.files || req.files.length === 0){
            return res.status(400).json({message: 'No files Uploaded'});
        }

        const uploadPromises = req.files.map(file => {
            return new Promise((resolve, reject) => {
                let resourceType = 'auto';
                if(file.mimetype.startsWith('video/')){
                    resourceType = 'video';
                } else if (file.mimetype.startsWith('audio/')) {
                    resourceType = 'raw';
                }

                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'heritage-diary',
                        resource_type: resourceType,
                        transformation: resourceType === 'image' ? [{quality: 'auto', fetch_format: 'auto'}] : undefined,
                    },
                    (error, result) => {
                        if(error){
                            reject(error);
                        }else{
                            resolve({
                                url:result.secure_url,
                                publicId:result.public_id,
                                type:file.mimetype.split('/')[0],
                                format: result.format,
                                size: result.bytes,
                            });
                        }
                    }
                );

                uplaodStream.end(file.buffer);
            });
        });

        const uploadResults = await Promise.all(uploadPromise);

        res.status(200).json({
            message: 'File uploaded successfully',
            files: uploadResults,
        });
    }catch (error){
        next(error);
    }
};

//delete media file
// delete /api/media/:publicId

const deleteMedia = async(req, res, next) => {
    try{
        const {publicId} = req.params;

        if(!publicId) {
            return res.status(400).json({message :'public Id is required'});
        }

        const decodedPublicId = decodeURLComponent(publicId);

        const result = await cloudinary.uploader.destory(decodedPublicId, {
            resource_type: 'auto',
        });

        if(result.result === 'ok' || result.result === 'not found'){
            res.json({message: 'File deleted successfully'});
        } else {
            res.status(400).json({message: 'Failed to delete file '});
        }
    }catch (error) {
        next(error);
    }
};

//upload profile picture
//post /api/media/ profile-picture
const uploadProfilePicture = async (req, res, next) => {
    try{
        if(!req.file) {
            return res.status(400).json({message: 'No file uploaded'});
        }

        const uploadPromise = new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'heritage-diary/profiles',
                    transformation: [
                        { width:400, height: 400, crop: 'fill', gravity:'face'},
                        {quality: 'auto', fetch_format: 'auto'},
                    ],
                },
                (error, result) => {
                    if(error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(req.file.buffer);
        });

        const result = await uploadPromise;

        const User = require('../models/User');
        await User.findByIdAndUpdate(req.user._id, {
            profilePicture: result.secure_url,
        });

        res.json({
            message: 'Profile picture uploaded successfully',
            url: result.secure_url,
            publicId: result.public_id,
        });
    }catch (error) {
        next(error);
    }
};

module.exports = {
    upload,
    uploadMedia,
    deleteMedia,
    uploadProfilePicture,
};