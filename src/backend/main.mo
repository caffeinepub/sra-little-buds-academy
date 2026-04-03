import List "mo:core/List";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Order "mo:core/Order";

actor {
  type Inquiry = {
    name : Text;
    phone : Text;
    message : Text;
    timestamp : Time.Time;
  };

  type UserProfile = {
    name : Text;
    email : Text;
    password : Text;
  };

  module Inquiry {
    public func compare(i1 : Inquiry, i2 : Inquiry) : Order.Order {
      Int.compare(i2.timestamp, i1.timestamp);
    };
  };

  let inquiries = List.empty<Inquiry>();
  let users = Map.empty<Text, UserProfile>();

  // ─── Inquiries

  public shared func submitInquiry(name : Text, phone : Text, message : Text) : async () {
    inquiries.add({ name; phone; message; timestamp = Time.now() });
  };

  public query func getAllInquiries() : async [Inquiry] {
    inquiries.toArray().sort();
  };

  // ─── Auth: Register

  public shared func registerUser(name : Text, email : Text, password : Text) : async Bool {
    if (users.containsKey(email)) { return false };
    users.add(email, { name; email; password });
    true;
  };

  // ─── Auth: Check email

  public query func isEmailRegistered(email : Text) : async Bool {
    users.containsKey(email);
  };

  // ─── Auth: Login

  public query func loginUser(email : Text, password : Text) : async { success : Bool; name : Text } {
    switch (users.get(email)) {
      case (null) { { success = false; name = "" } };
      case (?user) {
        if (user.password != password) { { success = false; name = "" } }
        else { { success = true; name = user.name } };
      };
    };
  };

  // ─── Auth: Forgot Password

  public shared func forgotPassword(email : Text, newPassword : Text) : async Bool {
    switch (users.get(email)) {
      case (null) { false };
      case (?user) {
        users.add(email, { user with password = newPassword });
        true;
      };
    };
  };

  // ─── Utilities

  public shared func clearAllInquiries() : async () { inquiries.clear() };
  public shared func clearAllUsers() : async () { users.clear() };
};
