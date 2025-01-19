from flask import Flask
import os
from supabase import create_client, Client

def create_supabase_client():
    supabase_url = os.environ.get('SUPABASE_URL')
    supabase_key = os.environ.get('SUPABASE_KEY')
    supabase: Client = create_client(supabase_url, supabase_key)
    return supabase

def create_app():
    app = Flask(__name__)
    # app.config.from_object(Config)

    app.supabase_client = create_supabase_client()

    from .api.routes import api
    app.register_blueprint(api, url_prefix='/api')

    return app