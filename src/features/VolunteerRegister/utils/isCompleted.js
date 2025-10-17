function isCompleted(request) {
  if (!request) return null;
  return request.is_completed
    ? request.is_completed
    : request.headcount_need === request.headcount_got;
}

export default isCompleted;
