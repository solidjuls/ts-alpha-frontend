import { useRouter } from "next/router";

const ResetPassword = () => {
  const router = useRouter();
  const { hash } = router.query;
  console.log("hash", hash);
  if (hash !== 'kjhgiuyagsdkjuhbgaskiuydgb') return <div>not valid link</div>;
  return <div>ResetPassword</div>;
};

export default ResetPassword;
