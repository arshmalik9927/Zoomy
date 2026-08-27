import Meeting from "../models/meeting.js";

const createMeeting = async (req, res) => {
    try {

        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({
                message: "User ID is required"
            });
        }

        const meetingCode = Math.random()
            .toString(36)
            .substring(2, 10)
            .toUpperCase();

        const meeting = await Meeting.create({
            meetingCode,
            host: userId,
            participants: [userId],
            status: "ongoing"
        });

        return res.status(201).json({
            message: "Meeting created successfully",
            meeting
        });

    } catch (error) {

        console.error("CREATE MEETING ERROR:", error);

        return res.status(500).json({
            message: "Failed to create meeting",
            error: error.message
        });
    }
};

export { createMeeting };