/* =========================================================
   Site configuration
   ---------------------------------------------------------
   This file is loaded before js/site.js. Edit the service
   image names and the hospital/clinic sections here.

   Service images live in gallery/<folder>/.
   Set "showMap": false to hide a location's map.
   ========================================================= */

window.DOC_J_DATA = {
  "services": [
    {
      "folder": "fracture-fixation",
      "title": "Fracture fixation",
      "description": "Surgical stabilisation of broken bones with plates, screws, nails or external fixation when a fracture needs operative care.",
      "images": [
        "fracture-fixation-01.jpg",
        "fracture-fixation-02.jpg",
        "fracture-fixation-03.jpg",
        "fracture-fixation-04.jpg",
        "fracture-fixation-05.jpg"
      ]
    },
    {
      "folder": "joint-replacement",
      "title": "Joint replacement",
      "description": "Assessment and operative care for worn or damaged joints, including hip and knee replacement where appropriate.",
      "images": [
        "joint-replacement-01.jpg",
        "joint-replacement-02.jpg",
        "joint-replacement-03.jpg",
        "joint-replacement-04.jpg",
        "joint-replacement-05.jpg"
      ]
    },
    {
      "folder": "spine",
      "title": "Spine related issues",
      "description": "Evaluation of neck and back pain, nerve-related symptoms and other spinal concerns, with guidance on non-surgical and surgical options.",
      "images": [
        "spine-01.jpg",
        "spine-02.jpg",
        "spine-03.jpg",
        "spine-04.jpg",
        "spine-05.jpg"
      ]
    },
    {
      "folder": "sports-injuries",
      "title": "Sports injuries",
      "description": "Care for ligament, tendon, cartilage and muscle injuries sustained in sport and everyday activity.",
      "images": [
        "sports-injuries-01.jpg",
        "sports-injuries-02.jpg",
        "sports-injuries-03.jpg",
        "sports-injuries-04.jpg",
        "sports-injuries-05.jpg"
      ]
    },
    {
      "folder": "paediatric-ortho",
      "title": "Paediatric orthopaedics",
      "description": "Assessment of bone and joint concerns in children, including fractures, growth-related conditions and gait concerns.",
      "images": [
        "paediatric-ortho-01.jpg",
        "paediatric-ortho-02.jpg",
        "paediatric-ortho-03.jpg",
        "paediatric-ortho-04.jpg",
        "paediatric-ortho-05.jpg"
      ]
    },
    {
      "folder": "hand-injuries",
      "title": "Hand-specific injuries",
      "description": "Treatment of fractures, tendon and nerve injuries and other problems affecting the hand and wrist.",
      "images": [
        "hand-injuries-01.jpg",
        "hand-injuries-02.jpg",
        "hand-injuries-03.jpg",
        "hand-injuries-04.jpg",
        "hand-injuries-05.jpg"
      ]
    },
    {
      "folder": "diabetic-foot",
      "title": "Diabetic foot",
      "description": "Multidisciplinary care for diabetic foot ulcers, infection and deformity, with an emphasis on limb preservation.",
      "images": [
        "diabetic-foot-01.jpg",
        "diabetic-foot-02.jpg",
        "diabetic-foot-03.jpg",
        "diabetic-foot-04.jpg",
        "diabetic-foot-05.jpg"
      ]
    },
    {
      "folder": "physiotherapy",
      "title": "Physiotherapy",
      "description": "Physiotherapy at home or at the clinic, arranged after assessment, with a focus on safe movement, strength and recovery.",
      "images": [
        "physiotherapy-01.jpg",
        "physiotherapy-02.jpg",
        "physiotherapy-03.jpg",
        "physiotherapy-04.jpg",
        "physiotherapy-05.jpg"
      ]
    },
    {
      "folder": "cpr-training",
      "title": "CPR training",
      "description": "Practical cardiopulmonary resuscitation training for individuals, families, workplaces and community groups.",
      "images": [
        "cpr-training-01.jpg",
        "cpr-training-02.jpg",
        "cpr-training-03.jpg",
        "cpr-training-04.jpg",
        "cpr-training-05.jpg"
      ]
    }
  ],
  "consultation": {
    "heading": "Consultation at",
    "sections": [
      {
        "title": "Hospitals & clinics",
        "locations": [
          {
            "id": "demo-hospital-central",
            "type": "hospital",
            "badge": {
              "label": "Hospital",
              "icon": "hospital"
            },
            "name": "Demo Hospital: Central",
            "address": "Central Bengaluru, Karnataka, India",
            "consultationDays": "Monday and Wednesday",
            "consultationHours": "10:00 AM to 1:00 PM",
            "latitude": 12.976,
            "longitude": 77.599,
            "showMap": true
          },
          {
            "id": "demo-hospital-east",
            "type": "hospital",
            "badge": {
              "label": "Hospital",
              "icon": "hospital"
            },
            "name": "Demo Hospital: East",
            "address": "East Bengaluru, Karnataka, India",
            "consultationDays": "Thursday",
            "consultationHours": "10:00 AM to 1:00 PM",
            "latitude": 12.971,
            "longitude": 77.67,
            "showMap": true
          },
          {
            "id": "demo-hospital-north",
            "type": "hospital",
            "badge": {
              "label": "Hospital",
              "icon": "hospital"
            },
            "name": "Demo Hospital: North",
            "address": "North Bengaluru, Karnataka, India",
            "consultationDays": "Tuesday",
            "consultationHours": "10:00 AM to 1:00 PM",
            "latitude": 13.035,
            "longitude": 77.597,
            "showMap": true
          },
          {
            "id": "demo-clinic-south",
            "type": "clinic",
            "badge": {
              "label": "Clinic",
              "icon": "clinic"
            },
            "name": "Demo Clinic: South",
            "address": "South Bengaluru, Karnataka, India",
            "consultationDays": "Saturday",
            "consultationHours": "4:00 PM to 7:00 PM",
            "latitude": 12.92,
            "longitude": 77.6,
            "showMap": true
          }
        ]
      },
      {
        "title": "Surgeries",
        "locations": [
          {
            "id": "demo-surgical-hospital",
            "type": "hospital",
            "badge": {
              "label": "Hospital",
              "icon": "hospital"
            },
            "name": "Demo Surgical Hospital: West",
            "address": "West Bengaluru, Karnataka, India",
            "consultationDays": "Surgery admission by arrangement",
            "consultationHours": "",
            "latitude": 12.99,
            "longitude": 77.55,
            "showMap": true
          },
          {
            "id": "demo-specialty-hospital",
            "type": "hospital",
            "badge": {
              "label": "Hospital",
              "icon": "hospital"
            },
            "name": "Demo Specialty Hospital: South",
            "address": "South Bengaluru, Karnataka, India",
            "consultationDays": "Surgery admission by arrangement",
            "consultationHours": "",
            "latitude": 12.91,
            "longitude": 77.58,
            "showMap": true
          }
        ]
      },
      {
        "title": "Visiting consultant at",
        "locations": [
          {
            "id": "demo-hospital-whitefield",
            "type": "hospital",
            "badge": {
              "label": "Hospital",
              "icon": "hospital"
            },
            "name": "Demo Hospital: Whitefield",
            "address": "Whitefield, Bengaluru, Karnataka, India",
            "consultationDays": "Friday",
            "consultationHours": "10:00 AM to 1:00 PM",
            "latitude": 12.9698,
            "longitude": 77.75,
            "showMap": true
          },
          {
            "id": "demo-hospital-jayanagar",
            "type": "hospital",
            "badge": {
              "label": "Hospital",
              "icon": "hospital"
            },
            "name": "Demo Hospital: Jayanagar",
            "address": "Jayanagar, Bengaluru, Karnataka, India",
            "consultationDays": "Tuesday and Saturday",
            "consultationHours": "4:00 PM to 7:00 PM",
            "latitude": 12.929,
            "longitude": 77.58,
            "showMap": true
          },
          {
            "id": "demo-hospital-yelahanka",
            "type": "hospital",
            "badge": {
              "label": "Hospital",
              "icon": "hospital"
            },
            "name": "Demo Hospital: Yelahanka",
            "address": "Yelahanka, Bengaluru, Karnataka, India",
            "consultationDays": "Thursday",
            "consultationHours": "4:00 PM to 6:00 PM",
            "latitude": 13.1,
            "longitude": 77.596,
            "showMap": true
          }
        ]
      }
    ]
  }
};
