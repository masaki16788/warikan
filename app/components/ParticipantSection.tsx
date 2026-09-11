import type { Participant } from "../lib/types";

type Props = {
  name: string;
  participants: Participant[];
  nameError: string;
  participantError: string;
  setName: (name: string) => void;
  handleAddParticipant: () => void;
  handleRemoveParticipant: (id: string) => void;
};

export default function ParticipantSection({
  name,
  participants,
  nameError,
  participantError,
  setName,
  handleAddParticipant,
  handleRemoveParticipant,
}: Props) {
  return (
    <section className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 sm:p-6">
      <h2>参加者</h2>

      <label htmlFor="participant-name">名前</label>
      <input
        id="participant-name"
        type="text"
        placeholder="例：田中さん"
        className="border rounded px-3 py-2"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />


      <button
        type="button"
        onClick={handleAddParticipant}
        className="bg-blue-500 text-white rounded px-4 py-2"
      >
        追加
      </button>
      {nameError && (
        <p role="alert" className="text-red-600">
          {nameError}
        </p>
      )}
      <ul>
        {participants.map((participant) => (
          <li key={participant.id} className="flex items-center gap-3">
            <span>{participant.name}</span>

            <button
              type="button"
              onClick={() => handleRemoveParticipant(participant.id)}
              className="text-red-600"
            >
              削除
            </button>
          </li>
        ))}
      </ul>
      {participantError && (
        <p role="alert" className="text-red-600">
          {participantError}
        </p>
      )}
    </section>
  );
}
