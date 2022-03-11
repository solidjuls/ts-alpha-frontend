import { useRouter } from "next/router";
import { date } from "zod";

const ResetPassword = () => {
  const router = useRouter();
  const { hash } = router.query;

  if (hash !== 'kjhgiuyagsdkjuhbgaskiuydgb') return <div>not valid link</div>;
  return <div>ResetPassword</div>;
};

export default ResetPassword;
