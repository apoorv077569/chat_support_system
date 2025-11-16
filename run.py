import os
from app import create_app, db
from sqlalchemy import text
from flask_socketio import SocketIO
import eventlet
import eventlet.wsgi

app = create_app()
socket_io = SocketIO(app,cors_allowed_origins="*")

# Check DB connection first
with app.app_context():
    try:
        with db.engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            value = result.scalar()
            print("DB Connected!" if value == 1 else "DB Connection Failed")
    except Exception as e:
        print("DB Connection Failed:", e)

# Start Flask server
if __name__ == "__main__":
    # app.run(host="127.0.0.1", port=5000, debug=True)
    socket_io.run(app,host="127.0.0.1",port=5000,debug=True)
    port = int(os.environ.get("PORT", 10000))
    eventlet.wsgi.server(eventlet.listen(("0.0.0.0", port)), app)

