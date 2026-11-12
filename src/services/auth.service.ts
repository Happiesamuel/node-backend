export function loginService({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const accessToken = "sam";
  return { accessToken };
}
