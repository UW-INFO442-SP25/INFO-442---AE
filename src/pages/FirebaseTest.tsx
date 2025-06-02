import { useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase.ts';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function FirebaseTest() {
  const [testStatus, setTestStatus] = useState<{[key: string]: string}>({});

  const runTests = async () => {
    // Test 1: Firebase Initialization
    try {
      if (auth && db) {
        setTestStatus(prev => ({ ...prev, initialization: '✅ Firebase initialized successfully' }));
      }
    } catch (error) {
      setTestStatus(prev => ({ ...prev, initialization: '❌ Firebase initialization failed' }));
    }

    // Test 2: Firestore Write/Read
    try {
      const testCollection = collection(db, 'test');
      const testDoc = await addDoc(testCollection, {
        test: 'Hello Firebase',
        timestamp: new Date()
      });
      
      const querySnapshot = await getDocs(testCollection);
      if (querySnapshot.size > 0) {
        setTestStatus(prev => ({ ...prev, firestore: '✅ Firestore read/write successful' }));
      }
    } catch (error) {
      setTestStatus(prev => ({ ...prev, firestore: `❌ Firestore test failed: ${error}` }));
    }

    // Test 3: Authentication
    try {
      const testEmail = `test${Date.now()}@example.com`;
      await createUserWithEmailAndPassword(auth, testEmail, 'testPassword123!');
      setTestStatus(prev => ({ ...prev, auth: '✅ Authentication successful' }));
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setTestStatus(prev => ({ ...prev, auth: '✅ Authentication test skipped (test user exists)' }));
      } else {
        setTestStatus(prev => ({ ...prev, auth: `❌ Authentication test failed: ${error.message}` }));
      }
    }
  };

  useEffect(() => {
    runTests();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Firebase Connection Tests</h2>
      <div className="space-y-2">
        {Object.entries(testStatus).map(([test, status]) => (
          <div key={test} className="p-2 bg-gray-100 rounded">
            <p><strong>{test}:</strong> {status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}