-- Create the trigger function
CREATE OR REPLACE FUNCTION handle_failed_login_attempts()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if login attempts exceed the threshold
    IF NEW.login_attempts >= 2 THEN
        -- Set blocked_until to 24 hours from now
        NEW.blocked_until := NOW() + INTERVAL '24 hours';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER trigger_handle_failed_login_attempts
AFTER UPDATE OF login_attempts
ON users
FOR EACH ROW
WHEN (OLD.login_attempts < 2 AND NEW.login_attempts >= 2)
EXECUTE FUNCTION handle_failed_login_attempts();
