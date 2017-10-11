import { recordifyCurrentUser, initialCurrentUser, ICurrentUser } from "../currentUser";
import { initialWallet, IWallet, WalletFactory } from "../wallet";

describe("currentUser model", () => {
  describe("CurrentUserStateFactory function", () => {
    it("should return initial state when there is no param", () => {
      expect(recordifyCurrentUser().toJS()).toEqual(initialCurrentUser);
    });

    it("should return recordified state when there is no param", () => {
      expect(recordifyCurrentUser().toString()).toContain("Record");
    });

    describe("when there are params", () => {
      let mockUserObject: ICurrentUser;
      const mockIsLoggedIn: boolean = false;
      const mockEmail: string = "tylor@pluto.network";
      const mockName: string = "TylorShin";
      const mockId: number = 123;
      const mockWallet: IWallet = initialWallet;
      const mockReputation: number = 13;
      const mockProfileImage: string = "https://test_profile_image.com";

      beforeEach(() => {
        mockUserObject = {
          isLoggedIn: mockIsLoggedIn,
          email: mockEmail,
          name: mockName,
          id: mockId,
          wallet: mockWallet,
          reputation: mockReputation,
          profileImage: mockProfileImage,
        };
      });

      it("should return recordified state", () => {
        expect(recordifyCurrentUser(mockUserObject).toString()).toContain("Record");
      });

      it("should return same isLoggedIn with params", () => {
        expect(recordifyCurrentUser(mockUserObject).isLoggedIn).toEqual(mockIsLoggedIn);
      });

      it("should return same email value with params", () => {
        expect(recordifyCurrentUser(mockUserObject).email).toEqual(mockEmail);
      });

      it("should return same name value with params", () => {
        expect(recordifyCurrentUser(mockUserObject).name).toEqual(mockName);
      });

      it("should return same id with params", () => {
        expect(recordifyCurrentUser(mockUserObject).id).toEqual(mockId);
      });

      it("should return same reputation with params", () => {
        expect(recordifyCurrentUser(mockUserObject).reputation).toEqual(mockReputation);
      });

      it("should return same profileImage with params", () => {
        expect(recordifyCurrentUser(mockUserObject).profileImage).toEqual(mockProfileImage);
      });

      it("should return recorded wallet with params", () => {
        expect(recordifyCurrentUser(mockUserObject).wallet).toEqual(WalletFactory(mockWallet));
      });
    });
  });
});
