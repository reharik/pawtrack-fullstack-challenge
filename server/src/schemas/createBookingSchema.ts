export const createBookingSchema = {
  body: {
    type: "object",
    required: ["petId", "sitterId", "scheduledDate", "startTime", "endTime"],
    properties: {
      petId: { type: "string" },
      sitterId: { type: "string" },
      scheduledDate: { type: "string", format: "date-time" },
      // TODO: Not validating HH:MM here. Built in 'time' format expects HH:MM:SS
      // fix: Have the frontend send a single ISO datetime so we can avoid stitching strings together
      startTime: { type: "string" },
      endTime: { type: "string" },
      notes: { type: "string", maxLength: 1000 },
    },
    additionalProperties: false,
  },
};
