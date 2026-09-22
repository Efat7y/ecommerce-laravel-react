import re

with open('frontend/src/components/Website/FloatingChat/MessagesDropdown.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_catch = """    } catch (err) {
      // Ignore 401 to prevent console spam when unauthenticated
      if (err.response && err.response.status !== 401) {
          console.error(err);
      }
    }"""
new_catch = """    } catch (err) {
      if (err.response && err.response.status === 401) {
          localStorage.removeItem('token');
          window.location.reload();
      } else {
          console.error(err);
      }
    }"""
content = content.replace(old_catch, new_catch)

with open('frontend/src/components/Website/FloatingChat/MessagesDropdown.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

# And in FloatingChat.jsx
with open('frontend/src/components/Website/FloatingChat/FloatingChat.jsx', 'r', encoding='utf-8') as f:
    content2 = f.read()

old_catch_2 = """    } catch (err) {
      if (err.response && err.response.status === 401) {
          closeChat(chat.user.id);
      }
    }"""
new_catch_2 = """    } catch (err) {
      if (err.response && err.response.status === 401) {
          closeChat(chat.user.id);
          localStorage.removeItem('token');
          window.location.reload();
      }
    }"""
content2 = content2.replace(old_catch_2, new_catch_2)

with open('frontend/src/components/Website/FloatingChat/FloatingChat.jsx', 'w', encoding='utf-8') as f:
    f.write(content2)

print("Fixed chat 401 handling")
