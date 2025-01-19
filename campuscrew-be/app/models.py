from werkzeug.security import generate_password_hash, check_password_hash
import os
from supabase import create_client
import uuid
from datetime import datetime

supabase = create_client(os.environ.get('SUPABASE_URL'), os.environ.get('SUPABASE_KEY'))

class Users:
    @staticmethod
    def create_user(email, password, first_name, last_name, user_id, is_pfw):
        hashed_password = generate_password_hash(password)
        response = supabase.table("users").insert({
            "email": email,
            "password": hashed_password,
            "first_name": first_name,
            "last_name": last_name,
            "user_id": user_id,
            "is_pfw": is_pfw
        }).execute()
        print(response)
        if not response.data:
            return None, f"Failed to create user: {response.data}"
        return response.data, None

    @staticmethod
    def find_by_email(email):
        response = supabase.table("users").select("*").eq("email", email).execute()
        if not response or len(response.data) == 0:
            return None
        return response.data[0]

    @staticmethod
    def check_password(user, password):
        return check_password_hash(user["password"], password)
class Services:
    @staticmethod
    def create_service(name, description, rate, category_id, user_id):
        service_id = str(uuid.uuid4())
        created_at = datetime.utcnow().isoformat()
        response = supabase.table("services").insert({
            "service_id": service_id,
            "name": name,
            "description": description,
            "rate": rate,
            "user_id": user_id,
            "category_id": category_id,
            "created_at": created_at
        }).execute()

        if not response.data:
            return None, f"Failed to create service: {response.error.message if response.error else 'Unknown error'}"
        return service_id, None

    @staticmethod
    def add_service_images(service_id, image_urls):
        image_records = [{"service_id": service_id, "image_url": url} for url in image_urls]
        response = supabase.table("serviceimages").insert(image_records).execute()

        if not response.data:
            return None, f"Failed to add service images: {response.error.message if response.error else 'Unknown error'}"
        return response.data, None

    @staticmethod
    def update_service(service_id, updates):
        return supabase.table('services').update(updates).eq('service_id', service_id).execute()
    
    @staticmethod
    def update_availability(availability_id, updates):
        return supabase.table('serviceavailability').update(updates).eq('availability_id', availability_id).execute()
    
    @staticmethod
    def get_booking_from_slot_id(slot_id):
        return supabase.table('bookings').select('booking_id').eq('availability_id', slot_id).execute()
    
    @staticmethod
    def delete_booking_with_booking_id(booking_id):
        return supabase.table('bookings').delete().eq('booking_id', booking_id).execute()
    
    @staticmethod
    def delete_booking_with_slot_id(availability_id):
        return supabase.table('bookings').delete().eq('availability_id', availability_id).execute()
    
    @staticmethod
    def get_bookings_from_service_id(service_id):
        return supabase.table('bookings').select('booking_id').eq('service_id', service_id).execute()
    
    @staticmethod
    def delete_multiple_bookings(booking_ids):
        return  supabase.table('bookings').delete().in_('booking_id', booking_ids).execute()
    
    @staticmethod
    def delete_slots(slot_id):
        return supabase.table('serviceavailability').delete().eq('availability_id', slot_id).execute()
    
    @staticmethod
    def delete_slots_with_service_id(service_id):
        return supabase.table('serviceavailability').delete().eq('service_id', service_id).execute()
    
    @staticmethod
    def delete_service_images(service_id):
        return supabase.table('serviceimages').delete().eq('service_id', service_id).execute()
    
    @staticmethod
    def delete_service(service_id):
        return supabase.table('services').delete().eq('service_id', service_id).execute()
    
    @staticmethod
    def get_avail_id_of_booking(booking_id):
        return supabase.table('bookings').select('availability_id').eq('booking_id', booking_id).single().execute()
    
    @staticmethod
    def update_book_status_false(availability_id):
        return supabase.table('serviceavailability').update({'is_booked': False}).eq('availability_id', availability_id).execute()
    
    @staticmethod
    def add_availability_slots(service_id, availability):
        slot_records = []

        for slot in availability:
            if 'max_hrs' not in slot or 'avail_slots' not in slot:
                return None, "Each availability slot must have 'max_hrs' and 'avail_slots'"

            if not isinstance(slot['avail_slots'], list):
                return None, "'avail_slots' must be a list of timestamps in string format"

            try:
                for ts in slot['avail_slots']:
                    datetime.strptime(ts, "%Y-%m-%d %H:%M:%S")  
                for ts in slot['avail_slots']:
                    slot_records.append({
                        "service_id": service_id,
                        "max_hrs": slot["max_hrs"], 
                        "avail_slots": ts,  
                        "is_booked": False  
                    })
            except ValueError:
                return None, "Invalid timestamp format in 'avail_slots'. Expected format: YYYY-MM-DD HH:MM:SS"

        response = supabase.table("serviceavailability").insert(slot_records).execute()

        if not response.data:
            return None, f"Failed to add service availability: {response.error.message if response.error else 'Unknown error'}"
        
        return response.data, None
    
    @staticmethod
    def get_all_services():
        try:
            response = supabase.table("services") \
                .select("*,serviceimages(image_url),serviceavailability(max_hrs, avail_slots, is_booked, availability_id),users!inner(first_name, last_name, email)") \
                .execute()

            if not response.data:
                return [], None

            return response.data, None
        except Exception as e:
            return None, f"Error fetching services: {str(e)}"

    @staticmethod
    def get_services_by_category(category_id):
        try:
            response = supabase.table("services") \
                .select("*, serviceimages(image_url), serviceavailability(max_hrs, avail_slots, is_booked, availability_id), users!inner(first_name, last_name, email)") \
                .eq("category_id", category_id) \
                .execute()

            if not response.data:
                return [], None

            return response.data, None
        except Exception as e:
            return None, f"Error fetching services by category: {str(e)}"

    @staticmethod
    def get_services_by_user(user_id):
        try:
            response = supabase.table("services") \
                .select("*, serviceimages(image_url), serviceavailability(max_hrs, avail_slots, is_booked, availability_id), users!inner(first_name, last_name, email)")\
                .eq("user_id", user_id) \
                .execute()

            if not response.data:
                return [], None

            return response.data, None
        except Exception as e:
            return None, f"Error fetching services by user: {str(e)}"

class Bookings:
    @staticmethod
    def create_booking(service_id, user_id, availability_id):
        try:
            availability_response = supabase.table("serviceavailability") \
                .select("*") \
                .eq("availability_id", availability_id) \
                .single() \
                .execute()

            if not availability_response.data:
                return None, "Selected time slot is not available"
            
            if availability_response.data.get("is_booked"):
                return None, "This time slot is already booked"
            
            booking_id = str(uuid.uuid4())
            
            booking_response = supabase.table("bookings").insert({
                "booking_id": booking_id,
                "service_id": service_id,
                "booked_by": user_id,
                "booking_time": datetime.utcnow().isoformat(),
                "availability_id": availability_id
            }).execute()

            if not booking_response.data:
                return None, "Failed to create booking"
            
            supabase.table("serviceavailability") \
                .update({"is_booked": True}) \
                .eq("availability_id", availability_id) \
                .execute()
            
            return booking_response.data[0], None

        except Exception as e:
            return None, str(e)

    @staticmethod
    def get_user_bookings(user_id):
        try:
            response = supabase.table("bookings") \
                .select("*,services(*,serviceimages(image_url)),serviceavailability(max_hrs, avail_slots, is_booked, availability_id),users!inner(first_name, last_name, email)") \
                .eq("booked_by", user_id) \
                .execute()

            if not response.data:
                return [], None

            return response.data, None
        except Exception as e:
            return None, f"Error fetching bookings: {str(e)}"

    @staticmethod
    def get_booking_details(booking_id):
        try:
            response = supabase.table("bookings") \
                .select("*,services(*,serviceimages(image_url)),serviceavailability(max_hrs, avail_slots, is_booked, availability_id),users!inner(first_name, last_name, email)") \
                .eq("booking_id", booking_id) \
                .single() \
                .execute()

            if not response.data:
                return None, "Booking not found"

            return response.data, None
        except Exception as e:
            return None, f"Error fetching booking details: {str(e)}"
