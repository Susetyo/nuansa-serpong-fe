SELECT COALESCE(SUM(point_remaining), 0)
FROM point_histories
WHERE user_id = :user_id
AND expired_at > NOW();