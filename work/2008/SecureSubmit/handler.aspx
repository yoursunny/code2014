<%@ Page Language="C#" Debug="true" %>
<%@ Import Namespace="System.Security.Cryptography" %>
<%@ Import Namespace="System.IO" %>
<script runat="server">
    //sample handler in C#
    protected override void OnLoad(EventArgs e)
    {
        base.OnLoad(e);
        switch (Request.Params["a"])
        {
            case "genkey":
                genkey();
                break;
            case "save":
                save();
                break;
            case "show":
                //in production environment, never echo back the password!
                Response.Write(Session["password"]);
                break;
        }
    }
    private void genkey()
    {
        BigInteger g = new BigInteger(Request.Form["g"], 16);
        BigInteger n = new BigInteger(Request.Form["n"], 16);
        BigInteger X = new BigInteger(Request.Form["X"], 16);
        BigInteger y, Y, K;
        Random rand = new Random();
        byte[] key;
        do
        {
            y = new BigInteger(); y.genRandomBits(64, rand);
            Y = g.modPow(y, n);
            K = X.modPow(y, n);
            key = as64bits(K);
        } while (DES.IsWeakKey(key) || DES.IsSemiWeakKey(key));
        Response.ContentType = "application/json";
        Response.Write("{Y:'" + Y.ToHexString() + "'}");
        Session["key"] = K.ToHexString();
    }
    private byte[] as64bits(BigInteger K)
    {
        byte[] key = K.getBytes();
        if (key.Length < 8)
        {
            byte[] oldkey = key;
            key = new byte[8];
            Array.Copy(oldkey, 0, key, 8 - oldkey.Length, oldkey.Length);
        }
        return key;
    }
    private void save()
    {
        BigInteger K = new BigInteger(Session["key"].ToString(), 16);
        byte[] key = as64bits(K);
        DES crypt = DES.Create();
        crypt.Key = key;
        crypt.Mode = CipherMode.ECB;
        crypt.Padding = PaddingMode.Zeros;
        ICryptoTransform decryptor = crypt.CreateDecryptor();
        byte[] input = Convert.FromBase64String(Request.Form["v"]);
        MemoryStream ms = new MemoryStream();
        CryptoStream cs = new CryptoStream(ms, decryptor, CryptoStreamMode.Write);
        cs.Write(input, 0, input.Length);
        cs.FlushFinalBlock();
        string m = Encoding.UTF8.GetString(ms.ToArray()).TrimEnd('\0');
        Session["password"] = m;
    }
</script>