
CryptoTest = TestCase("CryptoTest");

CryptoTest.prototype.testSHA256 = function() {
  var result = Crypto.util.bytesToBase64(Crypto.SHA256("", {asBytes: true}));
  assertEquals("47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=", result);
  
};



DOHTest = TestCase("DOHTest");

DOHTest.prototype.testSHA256 = function () {
  DOH_UI.init(domain_specs);
  console.log(DOH_UI.domainSpecs);
  var salt = 'test';
  var pwd = 'test';
  var opts = {'domain': 'test.com', 
    'salt': salt,
    'hashedMaster': Crypto.util.bytesToBase64(Crypto.SHA256(salt + pwd, {asBytes: true})),
    'seq': '', 
    'hashFunction': 'sha256'};
  assertEquals("KG\"?.Aad%( >*BC=#E%n",DOH.gen_password(opts));
};
