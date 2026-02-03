SELECT *
FROM point_histories
WHERE user_id = :user_id
AND expired_at > NOW()
AND point_remaining > 0
ORDER BY expired_at ASC, earned_at ASC;