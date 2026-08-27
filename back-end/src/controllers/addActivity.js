const addToActivity = async (req, res) => {
    try {
        const { userId, meetingCode } = req.body;

        if (!userId || !meetingCode) {
            return res.status(400).json({
                message: "User ID and meeting code are required"
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.activity.push({
            meetingCode: meetingCode,
            date: new Date()
        });

        await user.save();

        return res.status(200).json({
            message: "Activity added successfully",
            activity: user.activity
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to add activity",
            error: error.message
        });
    }
};

export {addToActivity};